import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ItemForm from "./ItemForm";
import { useClaimContext } from "@/context/ClaimContext";

interface Item {
  id: number;
  roomId: number;
  name: string;
  description: string;
  category: string;
  cost: number;
  quantity: number;
  purchaseDate: string;
  imageUrls: string[];
  createdAt: string;
}

interface ItemListProps {
  roomId: number;
  onItemListChanged: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ roomId, onItemListChanged }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { currency } = useClaimContext();

  useEffect(() => {
    fetchItems();
  }, [roomId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms/${roomId}/items`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to load items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item: Item) => {
    setEditItem(item);
    setOpenDialog(true);
  };

  const handleDeleteItem = async (id: number) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Update the UI by removing the deleted item
      setItems(items.filter(item => item.id !== id));
      onItemListChanged();
      
      toast({
        title: "Item Deleted",
        description: "The item has been successfully removed."
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleItemUpdated = () => {
    fetchItems();
    setOpenDialog(false);
    setEditItem(null);
    onItemListChanged();
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
        <div className="py-3 px-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-md font-semibold text-slate-800">Loading Items...</h3>
        </div>
        <div className="p-4 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
      <div className="py-3 px-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-md font-semibold text-slate-800">Added Items</h3>
      </div>
      
      <div className="divide-y divide-slate-200">
        {items.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-slate-500">No items added yet for this room.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="py-3 px-4 hover:bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-md font-medium text-slate-800">{item.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-slate-800">{formatCurrency(item.cost)}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="text-sm text-slate-600">{item.category}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-1 text-slate-400 hover:text-slate-800 focus:outline-none"
                    onClick={() => handleEditItem(item)}
                  >
                    <i className="ri-pencil-line"></i>
                  </button>
                  <button
                    className="p-1 text-slate-400 hover:text-red-500 focus:outline-none"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
              
              {item.imageUrls.length > 0 && (
                <div className="mt-2 flex -space-x-2 overflow-hidden">
                  {item.imageUrls.slice(0, 3).map((url, idx) => (
                    <img
                      key={idx}
                      className="inline-block h-10 w-10 rounded-md ring-2 ring-white"
                      src={url}
                      alt={`${item.name} image ${idx + 1}`}
                    />
                  ))}
                  {item.imageUrls.length > 3 && (
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-200 ring-2 ring-white">
                      <span className="text-xs font-medium text-slate-600">
                        +{item.imageUrls.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <ItemForm
              roomId={roomId}
              onItemAdded={handleItemUpdated}
              initialData={{
                name: editItem.name,
                category: editItem.category,
                description: editItem.description,
                cost: editItem.cost.toString(),
                quantity: editItem.quantity.toString(),
                purchaseDate: editItem.purchaseDate
              }}
              isEdit={true}
              itemId={editItem.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemList;
