import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useClaimContext } from "@/context/ClaimContext";

interface AIAssistantProps {
  onSuggestionsReceived: (suggestions: any[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestionsReceived }) => {
  const { selectedRoom } = useClaimContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getRoomDisplayName = (roomId: string): string => {
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

  const handleAISuggestions = async () => {
    if (!selectedRoom) {
      toast({
        title: "No Room Selected",
        description: "Please select a room first to get suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(
        "POST", 
        "/api/ai/room-items", 
        { room: getRoomDisplayName(selectedRoom) }
      );
      
      const data = await response.json();
      
      if (data && (data.items || data.suggestions)) {
        const suggestions = data.items || data.suggestions;
        onSuggestionsReceived(suggestions);
        toast({
          title: "Suggestions Ready",
          description: `Found ${suggestions.length} common items for this room.`,
        });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        title: "Couldn't Get Suggestions",
        description: "There was an error getting suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <i className="ri-robot-line text-2xl text-primary-600"></i>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-slate-800">AI Assistant</h3>
          <p className="text-sm text-slate-600 mt-1">
            I can help suggest common items for each room. Just select a room and I'll help you remember what might have been there.
          </p>
          <div className="mt-3 flex items-center">
            <Button 
              onClick={handleAISuggestions}
              disabled={isLoading || !selectedRoom}
              variant="outline"
              className="inline-flex items-center border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Getting Suggestions...</span>
                </>
              ) : (
                <>
                  <i className="ri-ai-generate text-lg mr-1"></i> Use AI Suggestions
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
