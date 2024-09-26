import { Box, FormControl, FormLabel, Input, Button, Heading, Text, VStack, Link } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { controllerHandleRegister } from "../controllers/RegisterController";


const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
      const showError = (message) => {
          setErrorMessage(message);
          console.log(message);
          setTimeout(() => setErrorMessage(''), 5000);
          
      };
      const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage('');
            navigate('/login'); // Navigate to login after 5 seconds
        }, 5000);
    };
  
      if (!email) {
          showError('Must enter email');
      } else if (!password) {
          showError('Must enter password');
      } else if (password !== confirmPassword) {
          showError("Passwords don't match");
      } else {
          const result = await controllerHandleRegister(email, password);
          if (!result.success) {
              showError(result.message);
          } else {
            showSuccess('Registration successful! Redirecting to login...');
          }
      }
  };

  return (
    <Box
      bgGradient="linear(to-r, pink.500,orange.500)" 
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingX={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="lg"
        boxShadow="lg"
        maxW="400px"
        w="100%"
      >
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="lg">
            Create Your Account
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Please fill in the details to register
          </Text>

          {/* Form */}
          <VStack spacing={4} w="100%">
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              />
            </FormControl>

            <FormControl id="confirm-password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            {/* Error Message */}
            {errorMessage && (
              <Text color="red.500" fontSize="sm">
                {errorMessage}
               </Text>
            )}
            {/* Success Message */}
            {successMessage && (
                <Text color="green.500" fontSize="sm">
                  {successMessage}
                </Text>
              )}

            <Button
              colorScheme="teal"
              size="lg"
              w="100%"
              _hover={{ bg: "teal.600" }}
              onClick={() => handleRegister()} // Replace with actual registration logic
            >
              Register
            </Button>

            {/* Login Link */}
            <Text fontSize="sm" color="gray.500">
              Already have an account?{" "}
              <Link color="teal.500" 
              onClick={() => navigate('/login')}>
                Login here
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterForm;
