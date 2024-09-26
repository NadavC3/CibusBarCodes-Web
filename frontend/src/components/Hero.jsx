import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Hero = () => {


    const navigate = useNavigate(); // Initialize useNavigate


  return (
    <Box
      bgGradient="linear(to-r, pink.500,orange.500)" 
      color="white"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingX={[4, 8]}
      paddingY={[6, 10]}
    >
      <VStack spacing={8} textAlign="center" maxW="600px">
        <Heading as="h1" size="2xl" fontWeight="extrabold" letterSpacing="wide">
          Manage Your Cibus Coupons
        </Heading>
        <Text fontSize="lg" lineHeight="tall" opacity={0.9}>
          Easily add, filter, and manage all your coupons in one place
        </Text>

        {/* Horizontal Stack - position buttons next to each other */}
        <HStack spacing={4} justify="center">
          <Button
            colorScheme="gray"
            variant="solid"
            size="lg"
            bg="gray.600"
            _hover={{ bg: "teal.500" }}
            onClick={() => navigate('/login')} 
          >
            <Text color="white">Login</Text>
            </Button>
          <Button
            colorScheme="gray"
            variant="solid"
            size="lg"
            bg="gray.600"
            _hover={{ bg: "teal.500" }}
            onClick={() => navigate('/register')}  // Replace with registration logic
          >
            <Text color="white">Register</Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Hero;
