import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import StepNavigator from "@/components/StepNavigator";
import RoomSelector from "@/components/RoomSelector";
import AIAssistant from "@/components/AIAssistant";
import { useClaimContext } from "@/context/ClaimContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RoomSuggestion {
  name: string;
  category: string;
  estimatedCost: number;
}

const RoomSelection: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    claim, 
    selectedRooms, 
    selectedRoom, 
    setSelectedRoom,
    setRoomId
  } = useClaimContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<RoomSuggestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!claim) {
      toast({
        title: "No active claim",
        description: "Please complete the personal information step first.",
        variant: "destructive"
      });
      setLocation("/personal-info");
    }
  }, [claim, setLocation]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleSuggestionsReceived = (roomSuggestions: RoomSuggestion[]) => {
    setSuggestions(roomSuggestions);
  };

  const handleContinue = async () => {
    if (selectedRooms.length === 0) {
      toast({
        title: "No Rooms Selected",
        description: "Please select at least one room to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create room entries in the database for each selected room
      await Promise.all(
        selectedRooms.map(async (roomId) => {
          const roomName = getRoomName(roomId);
          const isCustom = roomId === "other";
          
          const roomData = {
            claimId: claim?.id,
            name: roomName,
            isCustom
          };
          
          const response = await apiRequest("POST", "/api/rooms", roomData);
          const savedRoom = await response.json();
          
          // Store the room ID in context for later use
          setRoomId(roomId, savedRoom.id);
        })
      );
      
      // Determine which room to go to for item details
      const firstRoom = selectedRooms[0] || null;
      if (firstRoom) {
        setSelectedRoom(firstRoom);
        setLocation("/item-details");
      } else {
        setLocation("/review");
      }
    } catch (error) {
      console.error("Error saving rooms:", error);
      toast({
        title: "Error",
        description: "Failed to save room selections. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <>
      <StepNavigator />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Select Room</h2>
            <p className="text-slate-600 mb-6">Choose the rooms where you had lost or damaged items.</p>

            <RoomSelector onRoomSelect={handleRoomSelect} />

            <AIAssistant onSuggestionsReceived={handleSuggestionsReceived} />

            {suggestions.length > 0 && (
              <div className="mb-8 border border-slate-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-slate-800 mb-3">Suggested Items for {getRoomName(selectedRoom || '')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((item, index) => (
                    <div key={index} className="flex justify-between border border-slate-200 rounded-md p-3 hover:bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.category}</p>
                      </div>
                      <div className="text-primary-600 font-medium">
                        ${item.estimatedCost.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/personal-info")}
                >
                  Back
                </Button>
                
                <Button 
                  onClick={handleContinue}
                  disabled={isSubmitting || selectedRooms.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Continue to Item Details"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomSelection;
