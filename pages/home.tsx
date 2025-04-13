
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import RoomChecklist from '../components/RoomChecklist';
import { getSuggestionsForRoom } from '../lib/ai';

// Common room types
const commonRooms = [
  'Living Room',
  'Kitchen',
  'Master Bedroom',
  'Bathroom',
  'Dining Room',
  'Office',
  'Garage',
  'Basement',
  'Attic',
  'Laundry Room',
];

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingClaim, setIsCreatingClaim] = useState(false);

  // Handle room selection change
  const handleRoomChange = (rooms: string[]) => {
    setSelectedRooms(rooms);
  };

  const handleContinue = async () => {
    if (selectedRooms.length === 0) {
      toast({
        title: 'No rooms selected',
        description: 'Please select at least one room to continue.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingClaim(true);
    
    try {
      // In a real app, you would create a claim and rooms in Firebase
      // For now, we'll just use local storage
      const claimId = 'claim_' + Date.now();
      
      // Save selected rooms
      localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
      localStorage.setItem('currentClaimId', claimId);
      
      // Navigate to the form page for the first room
      router.push({
        pathname: '/form',
        query: { room: selectedRooms[0] },
      });
    } catch (error) {
      console.error('Error creating claim:', error);
      toast({
        title: 'An error occurred.',
        description: 'Unable to create your claim.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingClaim(false);
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Select Rooms in Your Home
        </Heading>
        
        <Text>
          Select the rooms that were affected by the wildfire. You'll be able to add
          items for each room in the next steps.
        </Text>
        
        <RoomChecklist 
          rooms={commonRooms} 
          selectedRooms={selectedRooms} 
          onChange={handleRoomChange} 
        />
        
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleContinue}
          isLoading={isCreatingClaim}
          disabled={selectedRooms.length === 0}
        >
          Continue
        </Button>
      </VStack>
    </Box>
  );
}
