
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';
import ItemForm from '../components/ItemForm';
import { getSuggestionsForRoom } from '../lib/ai';

export default function FormPage() {
  const router = useRouter();
  const toast = useToast();
  const { room } = router.query;
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load existing items and get suggestions when the page loads
  useEffect(() => {
    if (!room) return;
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load existing items from storage
        const storedItems = localStorage.getItem('items');
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        
        // Filter items for this room
        const roomItems = parsedItems.filter((item: any) => item.room === room);
        setItems(roomItems);
        
        // Get AI suggestions for this room
        const roomSuggestions = await getSuggestionsForRoom(room as string);
        setSuggestions(roomSuggestions);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load suggestions or existing items.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [room, toast]);
  
  const handleAddItem = (newItem: any) => {
    // Add room info to the item
    const itemWithRoom = {
      ...newItem,
      room: room,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    // Update state
    const updatedItems = [...items, itemWithRoom];
    setItems(updatedItems);
    
    // Save to storage
    const storedItems = localStorage.getItem('items');
    const allItems = storedItems ? JSON.parse(storedItems) : [];
    localStorage.setItem('items', JSON.stringify([...allItems, itemWithRoom]));
    
    toast({
      title: 'Item added',
      description: `${newItem.name} has been added to your claim.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleNext = () => {
    // Get all selected rooms
    const selectedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
    const currentIndex = selectedRooms.indexOf(room);
    
    // If this is the last room, go to summary
    if (currentIndex === selectedRooms.length - 1) {
      router.push('/summary');
    } else {
      // Otherwise, go to the next room
      const nextRoom = selectedRooms[currentIndex + 1];
      router.push({
        pathname: '/form',
        query: { room: nextRoom },
      });
    }
  };
  
  return (
    <Box maxWidth="800px" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Add Items for {room}
        </Heading>
        
        <ItemForm 
          suggestions={suggestions}
          onSubmit={handleAddItem}
        />
        
        {items.length > 0 && (
          <Box>
            <Heading as="h2" size="md" mb={4}>
              Added Items ({items.length})
            </Heading>
            
            <VStack spacing={2} align="stretch">
              {items.map((item) => (
                <Box 
                  key={item.id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Flex justify="space-between">
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>
                      {item.quantity} × {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: item.currency || 'USD',
                      }).format(item.cost)}
                    </Text>
                  </Flex>
                  {item.description && (
                    <Text fontSize="sm" color="gray.600">
                      {item.description}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        )}
        
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleNext}
        >
          {currentIndex === selectedRooms?.length - 1 ? 'Go to Summary' : 'Next Room'}
        </Button>
      </VStack>
    </Box>
  );
}
