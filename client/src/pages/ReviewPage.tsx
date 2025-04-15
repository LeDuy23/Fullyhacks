import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import StepNavigator from "@/components/StepNavigator";
import { useClaimContext } from "@/context/ClaimContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/utils/currency";

interface Room {
  id: number;
  claimId: number;
  name: string;
  isCustom: boolean;
  items: Item[];
}

interface Item {
  id: number;
  roomId: number;
  name: string;
  description: string | null;
  category: string | null;
  cost: number;
  quantity: number;
  purchaseDate: string | null;
  imageUrls: string[];
  createdAt: string;
}

interface ClaimSummary {
  claim: {
    id: number;
    claimantId: number;
    totalValue: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  claimant: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    policyNumber: string | null;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    language: string;
    currency: string;
    createdAt: string;
  };
  rooms: Room[];
}

const ReviewPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { claim, currency, selectedRooms, setSelectedRoom } = useClaimContext();
  const [summary, setSummary] = useState<ClaimSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!claim) {
      toast({
        title: "No active claim",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
      setLocation("/personal-info");
      return;
    }

    fetchClaimSummary();
  }, [claim]);

  const fetchClaimSummary = async () => {
    if (!claim?.id) return;
    
    try {
      setLoading(true);
      const response = await apiRequest("GET", `/api/claims/${claim.id}/summary`);
      const data = await response.json();
      setSummary(data);
      
      // Calculate total value and total items
      let itemCount = 0;
      let value = 0;
      
      data.rooms.forEach((room: Room) => {
        room.items.forEach((item: Item) => {
          itemCount += item.quantity;
          value += (item.cost * item.quantity);
        });
      });
      
      setTotalItems(itemCount);
      setTotalValue(value);
    } catch (error) {
      console.error("Error fetching claim summary:", error);
      toast({
        title: "Error",
        description: "Failed to load claim summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPersonalInfo = () => {
    setLocation("/personal-info");
  };

  const handleEditRoom = (roomKey: string) => {
    setSelectedRoom(roomKey);
    setLocation(`/item-details/${roomKey}`);
  };

  const handleAddMoreItems = () => {
    setLocation("/room-selection");
  };

  const handleContinueToTemplates = () => {
    setLocation("/template-selection");
  };

  const getIconForRoom = (roomName: string): string => {
    const name = roomName.toLowerCase();
    if (name.includes("living")) return "ri-sofa-line";
    if (name.includes("kitchen")) return "ri-fridge-line";
    if (name.includes("bedroom")) return "ri-hotel-bed-line";
    if (name.includes("bathroom")) return "ri-shower-line";
    if (name.includes("garage")) return "ri-parking-box-line";
    return "ri-home-line";
  };

  // Look up room key from room name
  const getRoomKeyFromName = (roomName: string): string => {
    if (roomName.toLowerCase().includes("living")) return "living-room";
    if (roomName.toLowerCase().includes("kitchen")) return "kitchen";
    if (roomName.toLowerCase().includes("bedroom")) return "master-bedroom";
    if (roomName.toLowerCase().includes("bathroom")) return "bathroom";
    if (roomName.toLowerCase().includes("garage")) return "garage";
    return "other";
  };

  if (loading) {
    return (
      <>
        <StepNavigator />
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="max-w-4xl mx-auto text-center py-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Loading Your Items...</h2>
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!summary) {
    return (
      <>
        <StepNavigator />
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-slate-800 mb-4">No Claim Data</h2>
              <p className="text-slate-600 mb-6">There was an error loading your claim data. Please start over or try again later.</p>
              <Button onClick={() => setLocation("/")}>Go Back to Start</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StepNavigator />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Review Your Inventory</h2>
            <p className="text-slate-600 mb-6">Review all the rooms and items you've added. Make any necessary edits before proceeding.</p>
            
            {/* Summary Card */}
            <Card className="mb-8 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Claim Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Claimant</p>
                    <p className="text-base font-medium">{summary.claimant.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Property Address</p>
                    <p className="text-base font-medium">{summary.claimant.city}, {summary.claimant.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Items</p>
                    <p className="text-base font-medium">{totalItems} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Value</p>
                    <p className="text-base font-bold text-primary-700">
                      {formatCurrency(totalValue, currency)}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 mt-4 pt-3">
                  <p className="text-sm text-slate-500">Rooms</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {summary.rooms.map((room) => (
                      <Badge key={room.id} variant="outline" className="flex items-center">
                        <i className={`${getIconForRoom(room.name)} mr-1`}></i>
                        {room.name}
                        <span className="ml-1 bg-slate-100 text-slate-600 text-xs rounded-full px-1.5 py-0.5">
                          {room.items.length}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={handleEditPersonalInfo}
                >
                  <i className="ri-pencil-line mr-1"></i> 
                  Edit Personal Information
                </Button>
              </CardFooter>
            </Card>
            
            {/* Rooms Accordion */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Items by Room</h3>
              
              {summary.rooms.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg">
                  <p className="text-slate-600 mb-4">You haven't added any rooms or items yet.</p>
                  <Button onClick={handleAddMoreItems}>
                    <i className="ri-add-line mr-1"></i> Add Rooms & Items
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {summary.rooms.map((room) => (
                    <AccordionItem key={room.id} value={`room-${room.id}`}>
                      <AccordionTrigger className="hover:bg-slate-50 px-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3 bg-slate-100">
                            <i className={`${getIconForRoom(room.name)} text-xl text-slate-700`}></i>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-slate-800">{room.name}</div>
                            <div className="text-sm text-slate-500">
                              {room.items.length} {room.items.length === 1 ? 'item' : 'items'} • 
                              {formatCurrency(
                                room.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0),
                                currency
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <div className="mb-3 flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-sm"
                            onClick={() => handleEditRoom(getRoomKeyFromName(room.name))}
                          >
                            <i className="ri-pencil-line mr-1"></i> Edit Items
                          </Button>
                        </div>
                        
                        {room.items.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg">
                            <p className="text-slate-500">No items in this room yet.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                            {room.items.map((item) => (
                              <Card key={item.id} className="overflow-hidden bg-white">
                                <div className="flex">
                                  {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <div className="w-24 h-24 flex-shrink-0 bg-slate-100">
                                      <img 
                                        src={item.imageUrls[0]} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 flex-shrink-0 bg-slate-100 flex items-center justify-center">
                                      <i className="ri-image-line text-2xl text-slate-400"></i>
                                    </div>
                                  )}
                                  
                                  <div className="flex-grow p-3">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                                      <div className="font-medium text-primary-700">
                                        {formatCurrency(item.cost * item.quantity, currency)}
                                      </div>
                                    </div>
                                    
                                    <div className="text-xs text-slate-500 mt-1">
                                      {item.category && (
                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mr-2">
                                          {item.category}
                                        </span>
                                      )}
                                      {item.quantity > 1 && (
                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                          Qty: {item.quantity}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {item.description && (
                                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              
              {/* Add More Items Button */}
              <div className="mt-6 text-center">
                <Button 
                  variant="outline"
                  onClick={handleAddMoreItems}
                >
                  <i className="ri-add-line mr-1"></i> Add More Rooms & Items
                </Button>
              </div>
            </div>
            
            {/* Continue Button */}
            <div className="flex justify-end border-t border-slate-200 pt-6">
              <Button 
                onClick={handleContinueToTemplates}
                disabled={totalItems === 0}
              >
                Continue to Choose Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPage;