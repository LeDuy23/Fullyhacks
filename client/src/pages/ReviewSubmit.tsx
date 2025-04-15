import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import StepNavigator from "@/components/StepNavigator";
import ExportOptions from "@/components/ExportOptions";
import { useClaimContext } from "@/context/ClaimContext";
import { useToast } from "@/hooks/use-toast";
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

const ReviewSubmit: React.FC = () => {
  const [, setLocation] = useLocation();
  const { claim, currency } = useClaimContext();
  const [summary, setSummary] = useState<ClaimSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState<Set<number>>(new Set());
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
      const response = await fetch(`/api/claims/${claim.id}/summary`);
      if (!response.ok) {
        throw new Error("Failed to fetch claim summary");
      }
      const data = await response.json();
      setSummary(data);
      
      // Expand the first room by default
      if (data.rooms && data.rooms.length > 0) {
        setExpandedRooms(new Set([data.rooms[0].id]));
      }
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

  const toggleRoomExpand = (roomId: number) => {
    setExpandedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  const handleEditPersonalInfo = () => {
    setLocation("/personal-info");
  };

  const handleEditItem = (roomId: number) => {
    // Find the room in the context and navigate to item details for that room
    setLocation(`/item-details`);
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      
      // Refresh summary after deletion
      fetchClaimSummary();
      
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

  const handleSaveDraft = async () => {
    if (!claim?.id) return;
    
    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "draft" })
      });
      
      if (!response.ok) {
        throw new Error("Failed to save draft");
      }
      
      toast({
        title: "Draft Saved",
        description: "Your claim has been saved as a draft."
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportComplete = () => {
    toast({
      title: "PDF Generated",
      description: "Your claim document has been successfully exported."
    });
  };

  if (loading) {
    return (
      <>
        <StepNavigator />
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="max-w-3xl mx-auto text-center py-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Loading Claim Data...</h2>
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
            <div className="max-w-3xl mx-auto">
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
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Review Your Claim</h2>
            <p className="text-slate-600 mb-6">Please review all the information before submitting.</p>

            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-slate-800">Personal Information</h3>
                <button 
                  className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
                  onClick={handleEditPersonalInfo}
                >
                  <i className="ri-pencil-line mr-1"></i> Edit
                </button>
              </div>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="text-sm font-medium">{summary.claimant.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-sm font-medium">{summary.claimant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-sm font-medium">{summary.claimant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Policy Number</p>
                    <p className="text-sm font-medium">{summary.claimant.policyNumber || "Not provided"}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">Property Address</p>
                  <p className="text-sm font-medium">
                    {summary.claimant.streetAddress}, {summary.claimant.city}, {summary.claimant.state} {summary.claimant.zipCode}, {summary.claimant.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Items By Room Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-slate-800">Items by Room</h3>
                <div>
                  <span className="text-sm text-slate-600 mr-2">Total Estimated Value:</span>
                  <span className="text-sm font-bold text-primary-700">
                    {formatCurrency(summary.claim.totalValue, currency)}
                  </span>
                </div>
              </div>

              {/* Accordion for rooms */}
              <div className="space-y-3">
                {summary.rooms.length === 0 ? (
                  <div className="border border-slate-200 rounded-lg p-4 text-center">
                    <p className="text-slate-600">No rooms or items have been added yet.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setLocation("/room-selection")}
                      className="mt-2"
                    >
                      Add Rooms and Items
                    </Button>
                  </div>
                ) : (
                  summary.rooms.map((room) => (
                    <div key={room.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div 
                        className="bg-slate-50 px-4 py-3 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleRoomExpand(room.id)}
                      >
                        <div className="flex items-center">
                          <i className={`${
                            room.name.toLowerCase().includes("living") ? "ri-sofa-line" : 
                            room.name.toLowerCase().includes("kitchen") ? "ri-fridge-line" :
                            room.name.toLowerCase().includes("bedroom") ? "ri-hotel-bed-line" :
                            room.name.toLowerCase().includes("bathroom") ? "ri-shower-line" :
                            room.name.toLowerCase().includes("garage") ? "ri-parking-box-line" :
                            "ri-home-line"
                          } text-slate-700 mr-2`}></i>
                          <h4 className="font-medium text-slate-800">{room.name}</h4>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-primary-700 mr-2">
                            {formatCurrency(
                              room.items.reduce((total, item) => total + (item.cost * item.quantity), 0),
                              currency
                            )}
                          </span>
                          <i className={`ri-arrow-down-s-line text-lg transition-transform ${expandedRooms.has(room.id) ? '' : 'transform rotate-180'}`}></i>
                        </div>
                      </div>

                      {expandedRooms.has(room.id) && (
                        <div className="px-4 py-3 border-t border-slate-200">
                          {room.items.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-sm text-slate-500">No items added to this room yet.</p>
                              <button 
                                className="mt-2 text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
                                onClick={() => handleEditItem(room.id)}
                              >
                                <i className="ri-add-line mr-1"></i> Add Items
                              </button>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                  <tr>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                  {room.items.map(item => (
                                    <tr key={item.id}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-slate-800">{item.name}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">{item.description || '-'}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 text-right">{item.quantity}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-slate-800 text-right">
                                        {formatCurrency(item.cost * item.quantity, currency)}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                          className="text-primary-600 hover:text-primary-900 mr-2"
                                          onClick={() => handleEditItem(room.id)}
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          className="text-red-600 hover:text-red-900"
                                          onClick={() => handleDeleteItem(item.id)}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Export Options */}
            {claim?.id && (
              <ExportOptions 
                claimId={claim.id} 
                onExport={handleExportComplete} 
              />
            )}

            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/item-details")}
                >
                  Back
                </Button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <i className="ri-save-line mr-1"></i>
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    disabled={!summary || summary.rooms.length === 0}
                    onClick={() => {
                      if (claim?.id) {
                        document.getElementById("export-pdf-btn")?.click();
                      }
                    }}
                  >
                    <i className="ri-file-download-line mr-1"></i>
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewSubmit;
