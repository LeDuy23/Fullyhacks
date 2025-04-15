import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import ItemDetailsAIAssistant from "./ItemDetailsAIAssistant";
import { useClaimContext } from "@/context/ClaimContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Electronics",
  "Furniture",
  "Appliances",
  "Clothing",
  "Jewelry",
  "Kitchenware",
  "Tools",
  "Other"
];

const itemSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  category: z.string().optional(),
  description: z.string().optional(),
  cost: z.string().min(1, { message: "Cost is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  purchaseDate: z.string().optional()
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  roomId: number;
  onItemAdded: () => void;
  initialData?: ItemFormData;
  isEdit?: boolean;
  itemId?: number;
}

const ItemForm: React.FC<ItemFormProps> = ({ 
  roomId, 
  onItemAdded, 
  initialData, 
  isEdit = false,
  itemId
}) => {
  const { currency } = useClaimContext();
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialData || {
      name: "",
      category: "",
      description: "",
      cost: "",
      quantity: "1",
      purchaseDate: ""
    }
  });

  const handleImageUpload = (base64Images: string[]) => {
    setImages(base64Images);
  };

  const onSubmit = async (data: ItemFormData) => {
    const itemData = {
      roomId,
      name: data.name,
      category: data.category || "Other",
      description: data.description || "",
      cost: parseFloat(data.cost),
      quantity: parseInt(data.quantity) || 1,
      purchaseDate: data.purchaseDate || "",
      imageUrls: images
    };

    try {
      if (isEdit && itemId) {
        await fetch(`/api/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData)
        });
        toast({
          title: "Item Updated",
          description: `${data.name} has been updated successfully.`
        });
      } else {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData)
        });
        toast({
          title: "Item Added",
          description: `${data.name} has been added to your inventory.`
        });
      }
      
      form.reset({
        name: "",
        category: "",
        description: "",
        cost: "",
        quantity: "1",
        purchaseDate: ""
      });
      setImages([]);
      onItemAdded();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    form.reset({
      name: "",
      category: "",
      description: "",
      cost: "",
      quantity: "1",
      purchaseDate: ""
    });
    setImages([]);
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      JPY: "¥"
    };
    return symbols[currencyCode] || "$";
  };

  return (
    <div className="border border-slate-200 rounded-lg p-5 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {isEdit ? "Edit Item" : "Add Item"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="TV, Sofa, Chair, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brand, model, size, color, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* AI Assistant to help find prices and retailer links */}
          <ItemDetailsAIAssistant 
            name={form.watch("name")}
            description={form.watch("description") || ""}
            category={form.watch("category") || ""}
            onPriceEstimateSelected={(price) => form.setValue("cost", price)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost ({currency})</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">
                          {getCurrencySymbol(currency)}
                        </span>
                      </div>
                      <Input
                        type="text"
                        className="pl-7"
                        placeholder="0.00"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date (if known)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
            <ImageUploader onImagesSelected={handleImageUpload} initialImages={images} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleReset}
            >
              <i className="ri-refresh-line mr-1"></i>
              Reset
            </Button>
            <Button type="submit">
              <i className={`${isEdit ? 'ri-save-line' : 'ri-add-line'} mr-1`}></i>
              {isEdit ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ItemForm;
