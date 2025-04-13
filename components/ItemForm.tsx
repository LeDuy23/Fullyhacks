
import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Textarea,
  Select,
  HStack,
  Text,
  useToast,
  InputGroup,
  InputLeftAddon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { estimateItemValue } from '../lib/ai';

interface ItemFormProps {
  suggestions: string[];
  onSubmit: (item: any) => void;
}

export default function ItemForm({ suggestions, onSubmit }: ItemFormProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setName(suggestion);
  };
  
  const handleEstimateValue = async () => {
    if (!name) {
      toast({
        title: 'Item name required',
        description: 'Please enter an item name to estimate its value.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsEstimating(true);
    
    try {
      const estimatedValue = await estimateItemValue(name, description);
      setCost(estimatedValue.toString());
      
      toast({
        title: 'Value Estimated',
        description: `The estimated value for ${name} is ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        }).format(estimatedValue)}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error estimating value:', error);
      toast({
        title: 'Estimation Failed',
        description: 'Unable to estimate the value. Please enter it manually.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsEstimating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !cost) {
      toast({
        title: 'Missing Information',
        description: 'Please enter item name and cost to continue.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const item = {
        name,
        description,
        quantity,
        cost: parseFloat(cost),
        currency,
        photoURL: photo ? URL.createObjectURL(photo) : undefined,
      };
      
      onSubmit(item);
      
      // Reset form
      setName('');
      setDescription('');
      setQuantity(1);
      setCost('');
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting item:', error);
      toast({
        title: 'Submission Failed',
        description: 'Unable to add the item. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {suggestions.length > 0 && (
          <Box>
            <Text mb={2} fontWeight="medium">Suggested Items:</Text>
            <Wrap>
              {suggestions.map((suggestion) => (
                <WrapItem key={suggestion}>
                  <Tag
                    size="lg"
                    colorScheme="blue"
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                  >
                    <TagLabel>{suggestion}</TagLabel>
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
        
        <FormControl isRequired>
          <FormLabel>Item Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Description (Optional)</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brand, model, condition, etc."
            rows={3}
          />
        </FormControl>
        
        <HStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              min={1}
              value={quantity}
              onChange={(_, value) => setQuantity(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Cost per Item</FormLabel>
            <InputGroup>
              <InputLeftAddon>
                {currency === 'USD' ? '$' : 
                 currency === 'EUR' ? '€' : 
                 currency === 'MXN' ? 'Mex$' : 
                 currency}
              </InputLeftAddon>
              <Input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </InputGroup>
          </FormControl>
          
          <FormControl>
            <FormLabel>Currency</FormLabel>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN (Mex$)</option>option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </Select>
          </FormControl>
        </HStack>
        
        <FormControl>
          <FormLabel>Photo (Optional)</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            p={1}
            ref={fileInputRef}
          />
        </FormControl>
        
        <HStack spacing={4}>
          <Button
            onClick={handleEstimateValue}
            isLoading={isEstimating}
            variant="outline"
            colorScheme="green"
          >
            Estimate Value
          </Button>
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            Add Item
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
