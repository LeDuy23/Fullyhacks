
import { useState } from 'react';
import {
  Box,
  VStack,
  Checkbox,
  Input,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';

interface RoomChecklistProps {
  rooms: string[];
  selectedRooms: string[];
  onChange: (selectedRooms: string[]) => void;
}

export default function RoomChecklist({
  rooms,
  selectedRooms,
  onChange,
}: RoomChecklistProps) {
  const [customRoom, setCustomRoom] = useState('');

  const handleToggleRoom = (room: string) => {
    const newSelectedRooms = selectedRooms.includes(room)
      ? selectedRooms.filter((r) => r !== room)
      : [...selectedRooms, room];
    
    onChange(newSelectedRooms);
  };

  const handleAddCustomRoom = () => {
    if (customRoom.trim() === '') return;
    
    const roomName = customRoom.trim();
    
    if (!selectedRooms.includes(roomName)) {
      onChange([...selectedRooms, roomName]);
    }
    
    setCustomRoom('');
  };

  return (
    <Box>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
        {rooms.map((room) => (
          <GridItem key={room}>
            <Checkbox
              isChecked={selectedRooms.includes(room)}
              onChange={() => handleToggleRoom(room)}
              size="lg"
              colorScheme="blue"
            >
              {room}
            </Checkbox>
          </GridItem>
        ))}
      </Grid>
      
      <Box mt={6}>
        <Text mb={2} fontWeight="medium">Add Custom Room</Text>
        <Flex>
          <Input
            value={customRoom}
            onChange={(e) => setCustomRoom(e.target.value)}
            placeholder="Enter room name..."
            mr={2}
          />
          <Button
            onClick={handleAddCustomRoom}
            colorScheme="blue"
            isDisabled={customRoom.trim() === ''}
          >
            Add
          </Button>
        </Flex>
      </Box>
      
      {selectedRooms.length > 0 && (
        <Box mt={6}>
          <Text fontWeight="bold" mb={2}>
            Selected Rooms ({selectedRooms.length}):
          </Text>
          <Text>{selectedRooms.join(', ')}</Text>
        </Box>
      )}
    </Box>
  );
}
