
import { ReactNode } from 'react';
import { Box, Flex, Text, Container, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex 
        as="header" 
        bg="blue.600" 
        color="white" 
        p={4} 
        alignItems="center"
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <NextLink href="/" passHref>
            <Link _hover={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="bold">Wildfire Claim App</Text>
            </Link>
          </NextLink>
        </Container>
      </Flex>
      
      <Box flex="1" py={8}>
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
      
      <Box as="footer" bg="gray.100" p={4} mt="auto">
        <Container maxW="container.xl">
          <Text textAlign="center" fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} Wildfire Claim App. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
