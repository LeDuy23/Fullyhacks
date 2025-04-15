import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import StepNavigator from "@/components/StepNavigator";
import ItemForm from "@/components/ItemForm";
import ItemList from "@/components/ItemList";
import { useClaimContext } from "@/context/ClaimContext";
import { useToast } from "@/hooks/use-toast";

interface RoomParam {
  roomId?: string;
}

const ItemDetails: React.FC = () => {
  const [, setLocation] = useLocation();
  const params = useParams<RoomParam>();
  const { 
    claim, 
    selectedRooms, 
    selectedRoom, 
    setSelectedRoom,
    roomsData,
    getRoomId
  } = useClaimContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize from URL param if present
  useEffect(() => {
    if (params.roomId && selectedRooms.includes(params.roomId)) {
      setSelectedRoom(params.roomId);
    } else if (!selectedRoom && selectedRooms.length > 0) {
      setSelectedRoom(selectedRooms[0]);
    }
  }, [params, selectedRooms, selectedRoom, setSelectedRoom]);

  useEffect(() => {
    if (!claim) {
      toast({
        title: "No active claim",
        description: "Please complete the personal information step first.",
        variant: "destructive"
      });
      setLocation("/personal-info");
    }
    
    if (selectedRooms.length === 0) {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room first.",
        variant: "destructive"
      });
      setLocation("/room-selection");
    }
  }, [claim, selectedRooms, setLocation]);

  const handleChangeRoom = () => {
    setLocation("/room-selection");
  };

  const handleItemAdded = () => {
    // Refresh the item list
    toast({
      title: "Item Added",
      description: "The item has been added successfully.",
    });
  };

  const handleItemListChanged = () => {
    // Update any necessary state or calculations
  };

  const handleContinue = () => {
    setLocation("/review");
  };

  const getRoomName = (roomId: string): string => {
    const roomNames: Record<string, string> = {
      "living-room": "Living Room",
      "kitchen": "Kitchen",
      "master-bedroom": "Master Bedroom",
      "bathroom": "Bathroom",
      "garage": "Garage",
      "other": "Other Room"
    };
    return roomNames[roomId] || roomId;
  };

  const getCurrentRoomId = (): number | undefined => {
    if (!selectedRoom) return undefined;
    return getRoomId(selectedRoom);
  };

  const databaseRoomId = getCurrentRoomId();

  if (!databaseRoomId || !selectedRoom) {
    return (
      <>
        <StepNavigator />
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="max-w-3xl mx-auto text-center py-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Loading Room Data...</h2>
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

  return (
    <>
      <StepNavigator />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                <i className={`${selectedRoom === "living-room" ? "ri-sofa-line" : 
                               selectedRoom === "kitchen" ? "ri-fridge-line" :
                               selectedRoom === "master-bedroom" ? "ri-hotel-bed-line" :
                               selectedRoom === "bathroom" ? "ri-shower-line" :
                               selectedRoom === "garage" ? "ri-parking-box-line" :
                               "ri-home-line"}`}></i>
                <span>{getRoomName(selectedRoom)}</span>
              </div>
              <button 
                className="ml-2 text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
                onClick={handleChangeRoom}
              >
                Change Room
              </button>
            </div>

            <ItemForm 
              roomId={databaseRoomId} 
              onItemAdded={handleItemAdded} 
            />

            <ItemList 
              roomId={databaseRoomId}
              onItemListChanged={handleItemListChanged}
            />

            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/room-selection")}
                >
                  Back
                </Button>
                
                <Button onClick={handleContinue}>
                  Continue to Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetails;
