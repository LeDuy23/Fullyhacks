import React, { createContext, useContext, useState, ReactNode } from "react";

interface Claimant {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  policyNumber?: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Claim {
  id?: number;
  claimantId: number;
  totalValue: number;
  status: string;
}

interface ClaimContextType {
  // Language and currency
  language: string;
  currency: string;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
  
  // Claimant and claim data
  claimant: Claimant | null;
  claim: Claim | null;
  setClaimant: (claimant: Claimant) => void;
  setClaim: (claim: Claim) => void;
  
  // Room selections
  selectedRooms: string[];
  selectedRoom: string | null;
  addRoom: (roomId: string) => void;
  removeRoom: (roomId: string) => void;
  setSelectedRoom: (roomId: string | null) => void;
  
  // Room data for backend
  roomsData: Map<string, number>;
  setRoomId: (roomKey: string, roomId: number) => void;
  getRoomId: (roomKey: string) => number | undefined;
}

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export const ClaimProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language and currency
  const [language, setLanguage] = useState<string>("EN");
  const [currency, setCurrency] = useState<string>("USD");
  
  // Claimant and claim data
  const [claimant, setClaimant] = useState<Claimant | null>(null);
  const [claim, setClaim] = useState<Claim | null>(null);
  
  // Room selection
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // Map to store room IDs from the backend
  const [roomsData, setRoomsData] = useState<Map<string, number>>(new Map());
  
  const addRoom = (roomId: string) => {
    setSelectedRooms(prev => {
      if (!prev.includes(roomId)) {
        return [...prev, roomId];
      }
      return prev;
    });
  };
  
  const removeRoom = (roomId: string) => {
    setSelectedRooms(prev => prev.filter(id => id !== roomId));
    if (selectedRoom === roomId) {
      setSelectedRoom(null);
    }
  };
  
  const setRoomId = (roomKey: string, roomId: number) => {
    setRoomsData(prev => {
      const newMap = new Map(prev);
      newMap.set(roomKey, roomId);
      return newMap;
    });
  };
  
  const getRoomId = (roomKey: string): number | undefined => {
    return roomsData.get(roomKey);
  };
  
  return (
    <ClaimContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        claimant,
        claim,
        setClaimant,
        setClaim,
        selectedRooms,
        selectedRoom,
        addRoom,
        removeRoom,
        setSelectedRoom,
        roomsData,
        setRoomId,
        getRoomId
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
};

export const useClaimContext = (): ClaimContextType => {
  const context = useContext(ClaimContext);
  if (context === undefined) {
    throw new Error("useClaimContext must be used within a ClaimProvider");
  }
  return context;
};
