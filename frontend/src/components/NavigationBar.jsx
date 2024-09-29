import { Flex, Box, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const NavigationBar = ({ email }) => {
  const [userEmail, setUserEmail] = useState(email);
  const navigate = useNavigate();
  
  // Dark mode toggle
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("teal.500", "teal.700");

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }
  }, [email]);

  const handleSignOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setUserEmail('');
    navigate("/");
  };

  return (
    <Flex
      direction="row"
      bg={bgColor}
      color="white"
      padding={4}
      justifyContent="space-between"
      alignItems="center"
      shadow="sm"
      mr={4}
    >
      {/* Left side: Dark mode toggle */}
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        isRound="true"
        size="md"
        onClick={toggleColorMode}
        aria-label="Toggle Dark Mode"
        bg="transparent"
        color="white"
        _hover={{ bg: "gray.600" }}
        mr={4}
      />

      <Box>
        {/* Right side: Avatar and sign-out dropdown */}
        {userEmail && (
          <Menu>
            <MenuButton>
              <Avatar name={userEmail} bg="pink.500" size="md" cursor="pointer" />
            </MenuButton>
            <MenuList>
              <MenuItem 
                onClick={handleSignOut}
                textColor="red"
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Flex>
  );
};

export default NavigationBar;
