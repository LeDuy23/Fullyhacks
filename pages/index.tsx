
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, VStack, Button, useToast } from '@chakra-ui/react';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';

export default function Welcome() {
  const router = useRouter();
  const toast = useToast();
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would save these preferences to Firebase
      // For now, we'll just use local storage
      localStorage.setItem('preferredLanguage', language);
      localStorage.setItem('preferredCurrency', currency);
      
      // Navigate to the home page
      router.push('/home');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'An error occurred.',
        description: 'Unable to save your preferences.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack
        spacing={8}
        p={8}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        width="100%"
        maxWidth="500px"
      >
        <Heading as="h1" size="xl">
          Welcome to the Wildfire Claim App
        </Heading>
        
        <VStack spacing={4} width="100%">
          <LanguageSelector value={language} onChange={setLanguage} />
          <CurrencySelector value={currency} onChange={setCurrency} />
        </VStack>
        
        <Button
          colorScheme="blue"
          size="lg"
          width="100%"
          onClick={handleContinue}
          isLoading={isLoading}
        >
          Continue
        </Button>
      </VStack>
    </Box>
  );
}
