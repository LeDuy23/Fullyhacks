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
          className={`room-card cursor-pointer bg-white border ${
            selectedRooms.includes(room.id)
              ? "border-primary-500 bg-blue-50"
              : "border-slate-200 hover:border-primary-500 hover:bg-blue-50"
          } rounded-lg p-4 transition-all`}
          onClick={() => handleRoomClick(room.id)}
        >
          <div className="flex items-center mb-2">
            <i className={`${room.icon} text-2xl text-slate-700 mr-2`}></i>
            <h3 className="font-medium text-slate-800">{room.name}</h3>
          </div>
          <p className="text-sm text-slate-600">{room.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RoomSelector;
