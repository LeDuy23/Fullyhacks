import { apiRequest } from "@/lib/queryClient";

export interface RoomSuggestion {
  name: string;
  category: string;
  estimatedCost: number;
}

export async function getRoomSuggestions(roomName: string): Promise<RoomSuggestion[]> {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/room-items",
      { room: roomName }
    );
    
    const data = await response.json();
    
    if (data && (data.items || data.suggestions)) {
      return data.items || data.suggestions;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching room suggestions:", error);
    // Return empty array on error
    return [];
  }
}

export function getFallbackSuggestions(roomName: string): RoomSuggestion[] {
  const roomMap: Record<string, RoomSuggestion[]> = {
    "living-room": [
      { name: "TV", category: "Electronics", estimatedCost: 800 },
      { name: "Sofa", category: "Furniture", estimatedCost: 1200 },
      { name: "Coffee Table", category: "Furniture", estimatedCost: 250 },
      { name: "Entertainment Center", category: "Furniture", estimatedCost: 400 },
      { name: "Bookshelf", category: "Furniture", estimatedCost: 150 }
    ],
    "kitchen": [
      { name: "Refrigerator", category: "Appliances", estimatedCost: 1200 },
      { name: "Microwave", category: "Appliances", estimatedCost: 150 },
      { name: "Toaster", category: "Appliances", estimatedCost: 50 },
      { name: "Dishwasher", category: "Appliances", estimatedCost: 600 },
      { name: "Cookware Set", category: "Kitchenware", estimatedCost: 300 }
    ],
    "master-bedroom": [
      { name: "Bed", category: "Furniture", estimatedCost: 1000 },
      { name: "Dresser", category: "Furniture", estimatedCost: 500 },
      { name: "Nightstand", category: "Furniture", estimatedCost: 150 },
      { name: "TV", category: "Electronics", estimatedCost: 500 },
      { name: "Clothing", category: "Clothing", estimatedCost: 2000 }
    ],
    "bathroom": [
      { name: "Shower Curtain", category: "Home Goods", estimatedCost: 30 },
      { name: "Towels", category: "Home Goods", estimatedCost: 100 },
      { name: "Bath Mat", category: "Home Goods", estimatedCost: 25 },
      { name: "Toiletries", category: "Personal Care", estimatedCost: 200 },
      { name: "Medicine Cabinet Items", category: "Personal Care", estimatedCost: 150 }
    ],
    "garage": [
      { name: "Tools", category: "Tools", estimatedCost: 500 },
      { name: "Lawn Equipment", category: "Tools", estimatedCost: 800 },
      { name: "Sports Equipment", category: "Sports", estimatedCost: 300 },
      { name: "Storage Containers", category: "Storage", estimatedCost: 100 },
      { name: "Workbench", category: "Furniture", estimatedCost: 200 }
    ]
  };

  return roomMap[roomName] || roomMap["living-room"];
}
