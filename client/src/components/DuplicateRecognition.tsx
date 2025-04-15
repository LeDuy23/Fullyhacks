import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileStack, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ItemMeta {
  id: number;
  name: string;
  description?: string;
  category?: string;
  cost: number;
  imageUrl?: string;
  source: string; // "receipt", "photo", "email", etc.
}

interface DuplicateRecognitionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDuplicate: (itemId1: number, itemId2: number, merge: boolean) => void;
  onRejectDuplicate: (itemId1: number, itemId2: number) => void;
  item1: ItemMeta;
  item2: ItemMeta;
  confidenceScore: number;
}

const DuplicateRecognition: React.FC<DuplicateRecognitionProps> = ({
  isOpen,
  onClose,
  onConfirmDuplicate,
  onRejectDuplicate,
  item1,
  item2,
  confidenceScore
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = (merge: boolean) => {
    setLoading(true);
    onConfirmDuplicate(item1.id, item2.id, merge);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 500);
  };

  const handleReject = () => {
    setLoading(true);
    onRejectDuplicate(item1.id, item2.id);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 500);
  };

  // Format confidence as percentage
  const confidencePercentage = Math.round(confidenceScore * 100);

  // Function to get confidence indicator color
  const getConfidenceColor = () => {
    if (confidenceScore >= 0.8) return "text-green-500";
    if (confidenceScore >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  // Function to get confidence text
  const getConfidenceText = () => {
    if (confidenceScore >= 0.8) return "High";
    if (confidenceScore >= 0.5) return "Medium";
    return "Low";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5 text-orange-500" />
            Potential Duplicate Items Detected
          </DialogTitle>
          <DialogDescription>
            We found items that might be duplicates. Please review and confirm if they are the same item.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-center mb-4">
            <div className={`text-sm font-medium ${getConfidenceColor()} flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100`}>
              <AlertTriangle className="h-4 w-4" />
              <span>{getConfidenceText()} Match Confidence ({confidencePercentage}%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item 1 */}
            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
              <div className="bg-blue-50 p-2 border-b">
                <h3 className="text-sm font-medium text-blue-800">Item from {item1.source}</h3>
              </div>
              
              {item1.imageUrl && (
                <div className="h-32 overflow-hidden">
                  <img 
                    src={item1.imageUrl} 
                    alt={item1.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-3">
                <h4 className="font-medium">{item1.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{item1.description || "No description"}</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500">{item1.category || "Uncategorized"}</span>
                  <span className="text-sm font-medium">${item1.cost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
              <div className="bg-green-50 p-2 border-b">
                <h3 className="text-sm font-medium text-green-800">Item from {item2.source}</h3>
              </div>
              
              {item2.imageUrl && (
                <div className="h-32 overflow-hidden">
                  <img 
                    src={item2.imageUrl} 
                    alt={item2.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-3">
                <h4 className="font-medium">{item2.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{item2.description || "No description"}</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500">{item2.category || "Uncategorized"}</span>
                  <span className="text-sm font-medium">${item2.cost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 p-3 rounded border text-sm space-y-0.5">
            <p className="font-medium">Are these the same item?</p>
            <p className="text-slate-600">• If these are the same item, you can merge them or keep both.</p>
            <p className="text-slate-600">• If you merge, we'll combine their details and documentation.</p>
            <p className="text-slate-600">• If they're different items, select "Not the same item".</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleReject}
            disabled={loading}
            className="flex items-center gap-1.5 sm:w-auto w-full"
          >
            <XCircle className="h-4 w-4 text-red-500" />
            <span>Not the same item</span>
          </Button>
          <div className="flex gap-2 sm:w-auto w-full">
            <Button 
              onClick={() => handleConfirm(false)}
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              Same item, keep both
            </Button>
            <Button 
              onClick={() => handleConfirm(true)}
              disabled={loading}
              className="flex items-center gap-1.5 flex-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Merge items</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateRecognition;