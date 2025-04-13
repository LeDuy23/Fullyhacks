
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  Text,
  Flex,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { useReactToPrint } from 'react-to-print';
import { exportClaimToPDF } from '../lib/pdf';

export default function Summary() {
  const router = useRouter();
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [items, setItems] = useState<any[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [currency, setCurrency] = useState('USD');
  
  // Load data when the page loads
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load items from storage
        const storedItems = localStorage.getItem('items');
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        setItems(parsedItems);
        
        // Load rooms from storage
        const storedRooms = localStorage.getItem('selectedRooms');
        const parsedRooms = storedRooms ? JSON.parse(storedRooms) : [];
        setRooms(parsedRooms);
        
        // Load currency from storage
        const storedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
        setCurrency(storedCurrency);
        
        // Calculate total cost
        const total = parsedItems.reduce((sum: number, item: any) => {
          return sum + (item.cost * item.quantity);
        }, 0);
        
        setTotalCost(total);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load claim data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Wildfire Claim Report',
  });
  
  const handleExportPDF = async () => {
    try {
      // Create a claim object for the PDF export
      const claim = {
        id: localStorage.getItem('currentClaimId') || 'claim_default',
        userId: 'user_default',
        status: 'draft',
        totalAmount: totalCost,
        currency: currency,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Create room objects for the PDF export
      const roomObjects = rooms.map((roomName, index) => ({
        id: `room_${index}`,
        name: roomName,
        userId: 'user_default',
        claimId: claim.id,
        createdAt: new Date(),
      }));
      
      // Export to PDF
      await exportClaimToPDF(claim, roomObjects, items, {
        uid: 'user_default',
        selectedCurrency: currency,
        selectedLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      toast({
        title: 'PDF Exported',
        description: 'Your claim report has been exported as a PDF.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to export PDF.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleEdit = (itemId: string) => {
    // Get the room for this item
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // Navigate to the form page for this room
    router.push({
      pathname: '/form',
      query: { room: item.room },
    });
  };
  
  const handleDelete = (itemId: string) => {
    // Remove the item from state
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Save to storage
    localStorage.setItem('items', JSON.stringify(updatedItems));
    
    // Recalculate total
    const newTotal = updatedItems.reduce((sum, item) => {
      return sum + (item.cost * item.quantity);
    }, 0);
    
    setTotalCost(newTotal);
    
    toast({
      title: 'Item deleted',
      description: 'The item has been removed from your claim.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box maxWidth="900px" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Claim Summary
        </Heading>
        
        <Box ref={printRef} p={4}>
          {rooms.map((room) => {
            const roomItems = items.filter(item => item.room === room);
            
            if (roomItems.length === 0) return null;
            
            return (
              <Box key={room} mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                  {room}
                </Heading>
                
                <VStack spacing={3} align="stretch">
                  {roomItems.map((item) => (
                    <Flex 
                      key={item.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md"
                      justify="space-between"
                      align="center"
                      bg="white"
                    >
                      <Box flex="1">
                        <Text fontWeight="bold">{item.name}</Text>
                        {item.description && (
                          <Text fontSize="sm" color="gray.600">
                            {item.description}
                          </Text>
                        )}
                      </Box>
                      
                      <Box textAlign="right">
                        <Text>
                          {item.quantity} × {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.currency || currency,
                          }).format(item.cost)}
                        </Text>
                        <Text fontWeight="bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.currency || currency,
                          }).format(item.cost * item.quantity)}
                        </Text>
                      </Box>
                      
                      <Flex ml={4}>
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => handleEdit(item.id)}
                          mr={2}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            );
          })}
          
          <Divider my={6} />
          
          <Flex justify="space-between" align="center" p={4} bg="gray.100" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold">
              Total Claim Amount:
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
              }).format(totalCost)}
            </Text>
          </Flex>
        </Box>
        
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleExportPDF}
            disabled={items.length === 0}
          >
            Export as PDF
          </Button>
          
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handlePrint}
            disabled={items.length === 0}
          >
            Print Claim
          </Button>
        </SimpleGrid>
        
        <Button
          variant="outline"
          size="md"
          onClick={() => router.push('/home')}
        >
          Edit Rooms
        </Button>
      </VStack>
    </Box>
  );
}
