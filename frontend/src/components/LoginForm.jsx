import {Box,FormControl,FormLabel,Input,Button,Heading,Text,VStack,Link,Checkbox,} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { controllerHandleLogin } from "../controllers/LoginController";
  
  const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [savedEmail, setSavedEmail] = useState('');
    const [savedPassword, setSavedPassword] = useState('');


    const navigate = useNavigate(); 


    // Check for stored login details
    useEffect(() => {
      const emailFromStorage = localStorage.getItem("email");
      const passwordFromStorage = localStorage.getItem("password");

      setSavedEmail(emailFromStorage);
      setSavedPassword(passwordFromStorage);

      if(savedEmail && savedPassword) {
        console.log("savedEmail = ", savedEmail);
        setEmail(emailFromStorage);
        setPassword(passwordFromStorage);
        setRememberMe(true);
        handleLogin()
      }
    }, [savedEmail, savedPassword]);


    const handleLogin = async () => {
      const showError = (message) => {
        setErrorMessage(message);
        console.log(message);
        setTimeout(() => setErrorMessage(""), 5000);
      };
  

      const currentEmail = savedEmail || email;
      const currentPassword = savedPassword || password;


  
      if (!currentEmail) {
        showError("Must enter email");
        return;
      }
      if (!currentPassword) {
        showError("Must enter password");
        return;
      }
  
      const { userId, message } = await controllerHandleLogin(currentEmail, currentPassword);
      if (userId) {
        if (rememberMe) {
          // Store the login details in localStorage if "Remember Me" is checked
          localStorage.setItem("email", currentEmail);
          localStorage.setItem("password", currentPassword);
        } 
  
        navigate("/coupons", { state: { userId, email: currentEmail } });
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

               {/* Remember Me Checkbox */}
                <Checkbox
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember Me
                </Checkbox>

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
  