import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";

interface Retailer {
  name: string;
  websiteUrl: string;
  searchUrl: string;
  searchTips: string;
  productCategory: string;
  priceRange: string;
}

interface ItemDetailsAIAssistantProps {
  name: string;
  description: string;
  category: string;
  onPriceEstimateSelected: (price: string) => void;
}

const ItemDetailsAIAssistant: React.FC<ItemDetailsAIAssistantProps> = ({
  name,
  description,
  category,
  onPriceEstimateSelected
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [showRetailers, setShowRetailers] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { toast } = useToast();

  // Effect to handle automatic search based on the item details provided
  useEffect(() => {
    if (name && (name !== "")) {
      setQuery(name + (description ? ` ${description}` : ""));
    }
  }, [name, description]);

  // Get retailer suggestions when item details change
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim().length > 2) {
      getProductLinks();
    }
  }, [debouncedQuery]);

  const getProductLinks = async () => {
    if (!query.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an item name or details",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Extract the item name from the query (first few words)
      const itemName = query.split(' ').slice(0, 3).join(' ');
      const remainingDescription = query.split(' ').slice(3).join(' ');

      const response = await apiRequest(
        "POST", 
        "/api/ai/product-links", 
        { 
          itemName,
          description: remainingDescription || description,
          category 
        }
      );
      
      const data = await response.json();
      
      if (data && data.retailers) {
        setRetailers(data.retailers);
        setShowRetailers(true);
        
        // Try to extract price estimate from first retailer
        if (data.retailers.length > 0) {
          const firstRetailer = data.retailers[0];
          if (firstRetailer.priceRange) {
            // Extract just the numeric middle value from price range
            // Example: "$20-$200" -> extract middle value "110"
            const priceRange = firstRetailer.priceRange;
            const priceMatch = priceRange.match(/\$(\d+)-\$(\d+)/);
            if (priceMatch && priceMatch.length >= 3) {
              const lowPrice = parseInt(priceMatch[1]);
              const highPrice = parseInt(priceMatch[2]);
              const middlePrice = Math.round((lowPrice + highPrice) / 2);
              
              toast({
                title: "Price Estimate",
                description: `Average price estimate: $${middlePrice}. Click to use this value.`,
                action: (
                  <Button 
                    variant="outline" 
                    onClick={() => onPriceEstimateSelected(middlePrice.toString())}
                  >
                    Use
                  </Button>
                )
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Product link suggestion error:", error);
      toast({
        title: "Couldn't Get Suggestions",
        description: "There was an error getting retailer information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Input
          placeholder="Describe your item for price and retailer suggestions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={getProductLinks}
          disabled={isLoading || !query.trim()}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Get Suggestions</span>
              <span className="sm:hidden">Search</span>
            </>
          )}
        </Button>
      </div>

      {showRetailers && retailers.length > 0 && (
        <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-800 mb-2">
            Suggested Retailers for {name || query}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {retailers.map((retailer, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm">{retailer.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {retailer.productCategory} • {retailer.priceRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-slate-600 mb-1">{retailer.searchTips}</p>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Price Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Price Estimates from {retailer.name}</h4>
                        <p className="text-xs">{retailer.priceRange}</p>
                        
                        {/* Extract and display the price range as buttons */}
                        {retailer.priceRange.match(/\$(\d+)-\$(\d+)/) && (
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            {(() => {
                              const match = retailer.priceRange.match(/\$(\d+)-\$(\d+)/);
                              if (match && match.length >= 3) {
                                const low = parseInt(match[1]);
                                const high = parseInt(match[2]);
                                const mid = Math.round((low + high) / 2);
                                
                                return (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => onPriceEstimateSelected(low.toString())}
                                    >
                                      ${low}
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      onClick={() => onPriceEstimateSelected(mid.toString())}
                                    >
                                      ${mid}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => onPriceEstimateSelected(high.toString())}
                                    >
                                      ${high}
                                    </Button>
                                  </>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <a 
                    href={retailer.searchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 text-xs hover:underline rounded-md px-2 py-1"
                  >
                    Search {retailer.name}
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsAIAssistant;