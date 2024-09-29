import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const NavigationBar = ({email}) => {
  const [userEmail, setUserEmail] = useState(email);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }
  }, [email]); 

  const handleSignOut = () => {
    // Clear local storage and navigate back to login
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setUserEmail('');
    navigate("/");
  };

  return (
    <Flex
      bg="teal.500"
      color="white"
      padding={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {userEmail ? `Welcome, ${userEmail}` : "Not logged in"}
        </Text>
      </Box>
      {userEmail && (
        <Button
          colorScheme='pink'
          variant="outline"
          onClick={handleSignOut}
          bg={"white"}
          borderColor='#ccd0d5'
          _hover={{ bg: '#ebedf0' }}
          mr={4}
        >
          Sign Out
        </Button>
      )}
    </Flex>
  );
};

export default NavigationBar;
