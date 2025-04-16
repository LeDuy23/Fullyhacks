import React from "react";
import { useClaimContext } from "@/context/ClaimContext";

interface Room {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const rooms: Room[] = [
  {
    id: "living-room",
    name: "Living Room",
    icon: "ri-sofa-line",
    description: "Furniture, electronics, decor"
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "ri-fridge-line",
    description: "Appliances, cookware, dinnerware"
  },
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    icon: "ri-hotel-bed-line",
    description: "Furniture, clothing, jewelry"
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: "ri-shower-line",
    description: "Fixtures, toiletries, linens"
  },
  {
    id: "garage",
    name: "Garage",
    icon: "ri-parking-box-line",
    description: "Tools, equipment, storage"
  },
  {
    id: "other",
    name: "Other Room",
    icon: "ri-add-line",
    description: "Specify a custom room"
  }
];

interface RoomSelectorProps {
  onRoomSelect: (roomId: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ onRoomSelect }) => {
  const { selectedRooms, addRoom, removeRoom } = useClaimContext();

  const handleRoomClick = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      removeRoom(roomId);
    } else {
      addRoom(roomId);
    }
    onRoomSelect(roomId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`room-card cursor-pointer bg-white border-2 ${
            selectedRooms.includes(room.id)
              ? "border-primary-600 bg-blue-50 shadow-md transform scale-105 transition-all duration-200"
              : "border-slate-200 hover:border-primary-400 hover:bg-blue-50"
          } rounded-lg p-4 transition-all duration-200`}
          onClick={() => handleRoomClick(room.id)}
        >
          <div className="flex items-center mb-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-3 ${
              selectedRooms.includes(room.id) 
                ? "bg-primary-100 text-primary-600 ring-2 ring-primary-200" 
                : "bg-slate-100 text-slate-700"
            } transition-all duration-200`}>
              <i className={`${room.icon} text-2xl`}></i>
            </div>
            <h3 className={`font-medium ${
              selectedRooms.includes(room.id) ? "text-primary-700" : "text-slate-800"
            }`}>{room.name}</h3>
            {selectedRooms.includes(room.id) && (
              <span className="ml-auto flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                <i className="ri-check-line mr-1"></i> Selected
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{room.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RoomSelector;
