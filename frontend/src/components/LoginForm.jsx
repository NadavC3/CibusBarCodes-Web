import {Box,FormControl,FormLabel,Input,Button,Heading,Text,VStack,Link,} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { controllerHandleLogin } from "../controllers/LoginController";
  
  const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate(); 


    const handleLogin = async () => {
      const showError = (message) => {
          setErrorMessage(message);
          console.log(message);
          setTimeout(() => setErrorMessage(''), 5000); 
      };
      if (!email) {
          showError('Must enter email');
          return; 
      }
      if (!password) {
          showError('Must enter password');
          return; 
      }

      const { userId, message } = await controllerHandleLogin(email, password);
      if (userId) {
          navigate('/coupons', { state: { userId } }); // Pass userId to the next screen
      } else {
          showError(message); 
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
              Login
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Please login to continue
            </Text>
  
            {/* Form */}
            <VStack spacing={4} w="100%">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
  
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              {/* Error Message */}
              {errorMessage && (
                <Text color="red.500" fontSize="sm">
                  {errorMessage}
                </Text>
              )}
  
              <Button
                colorScheme="teal"
                size="lg"
                w="100%"
                _hover={{ bg: "teal.600" }}
                onClick = {handleLogin} 
              >
                Login
              </Button>
  
              {/* Registration and Forgot Password Links */}
              <Text fontSize="sm" color="gray.500">
                Dont have an account?{" "}
                <Link color="teal.500" 
                onClick={() => navigate('/register')}
                >
                  Register here
                </Link>
              </Text>
  
              <Link color="teal.500" fontSize="sm" onClick={() => console.log("Forgot Password clicked")}>
                Forgot Password?
              </Link>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  };
  
  export default LoginForm;
  