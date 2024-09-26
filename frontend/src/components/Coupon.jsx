import { 
  Box, VStack, Heading, Text, Spinner, Grid, Button, Modal,Image, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, useToast, Link ,Textarea, Select, IconButton 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { controllerFetchCoupons, addCouponFromSMS, controllerDeleteCoupon } from "../controllers/CouponsController";
import acceptedPlaceIcons from "./acceptedPlaceIcons";
import { DeleteIcon } from "@chakra-ui/icons"; // Import DeleteIcon


// eslint-disable-next-line react/prop-types
const Coupons = ({ userId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlace, setSelectedPlace] = useState('all'); 
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [placesList, setPlacesList] = useState([]); 
  const toast = useToast();

  useEffect(() => {
    const fetchCoupons = async () => {
      const result = await controllerFetchCoupons(userId);
      if (result.success) {
        console.log("coupon data = ", result.data);
        setCoupons(result.data);
        setPlacesList(generatePlacesList(result.data)); 
        setFilteredCoupons(result.data); 
      } else {
        setErrorMessage(result.message);
      }
      setLoading(false);
    };

    fetchCoupons();
  }, [userId]);

  const handleAddCoupon = async () => {
    try {
      await addCouponFromSMS(smsMessage, userId);
      toast({
        title: "Coupon added.",
        description: "The coupon was added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSmsMessage('');
      onClose();
      setTimeout(() => {
        window.location.reload(); 
      }, 3000);
    } catch (error) {
      toast({
        title: "Error adding coupon.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const generatePlacesList = (coupons) => {
    const uniquePlaces = new Set(coupons.map(coupon => coupon.acceptedAt));
    return ['All', ...Array.from(uniquePlaces)];
  };

   const handleFilterChange = (event) => {
    const place = event.target.value;
    setSelectedPlace(place);
    if (place === 'all') {
      setFilteredCoupons(coupons); // Show all coupons if 'all' is selected
      console.log("coupons are:",coupons);
    } else {
      const filtered = coupons.filter(coupon => coupon.acceptedAt.toLowerCase() === place.toLowerCase());
      setFilteredCoupons(filtered);
    }
  };



  const handleDeleteCoupon = async (event,couponId) => {
    event.stopPropagation(); // Prevent opening link
    try{
      const status = await controllerDeleteCoupon(userId, couponId);
      if(status === 200){
        toast({
          title: "Coupon deleted.",
          description: "The coupon was deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Remove coupons shoing on the screen
        setCoupons(coupons.filter(coupon => coupon.id !== couponId));
        setFilteredCoupons(filteredCoupons.filter(coupon => coupon.id !== couponId));
      }
    } catch (error) {
      toast({
        title: "Error deleting coupon.",
        description: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
   }
  }


  return (
    <Box minH="100vh" bg="gray.100" py={10}>
      <VStack spacing={6} alignItems="center" maxW="container.md" mx="auto" px={6}>
        <Heading as="h1" size="lg" color="teal.500" mb={4}>
          My Coupons
        </Heading>


         {/* Filter dropdown */}
         <Select 
         value={selectedPlace} 
         onChange={handleFilterChange}
         borderWidth="2px" 
         borderColor="blue.500" 
         borderRadius="md"
         bg="white" 
         >
           {placesList.map((place, index) => (
            <option key={index} value={place.toLowerCase()}>{place}</option> 
          ))}
        </Select>

        {loading ? (
          <Spinner size="lg" />
        ) : errorMessage ? (
          <Text color="red.500" fontSize="lg" fontWeight="bold">{errorMessage}</Text>
        ) : filteredCoupons.length === 0 ? (
          <Text fontSize="lg">No coupons found.</Text>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} width="full">
             {(selectedPlace === 'all' ? coupons : filteredCoupons).map((coupon, index) => (
              <Link 
                key={index}
                href={coupon.link} 
                target="_blank" 
                rel="noopener noreferrer" // Security for external links
                _hover={{ textDecoration: "none" }}
              >
                <Box
                  bg="white"
                  p={5}
                  shadow="md"
                  rounded="md"
                  borderWidth="1px"
                  transition="0.2s"
                  _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                >
                  <Text fontWeight="bold" fontSize="lg" >
                  {coupon.company}
                  </Text>
                  <Text fontSize="xl" textAlign={"center"} fontWeight="bold">
                    ₪{coupon.amount}
                  </Text>
                  <Text fontSize="md"  fontWeight="bold" textAlign={"center"} mt={2}> 
                      {coupon.acceptedAt}
                  </Text>


                   {/* Display the icon if accepted place has one */}
                   {acceptedPlaceIcons[coupon.acceptedAt.toLowerCase()] && (
                    <Box 
                      display="flex" 
                      justifyContent="center" 
                      alignItems="center" 
                      mt={2} // Margin top can still be applied here if needed
                    >
                      <Image
                        src={acceptedPlaceIcons[coupon.acceptedAt.toLowerCase()]}
                        alt={`${coupon.acceptedAt} icon`}
                        boxSize="80px"
                      />
                    </Box>
                  )}
                    <IconButton
                      isRound={true}
                      variant='solid'
                      colorScheme='red'
                      aria-label='Done'
                      fontSize='20px'
                      icon={<DeleteIcon />}
                      onClick={(event) => handleDeleteCoupon(event,coupon.id)}
                      />
                </Box>
              </Link>
            ))}
          </Grid>
        )}

        <Button mt={6} colorScheme="teal" onClick={onOpen}>
          Add Coupon from SMS
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Coupon from SMS</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Enter SMS message here"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                size="lg"
                rows={5}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleAddCoupon}>
                Add Coupon
              </Button>
              <Button variant="ghost" onClick={onClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Button mt={6} colorScheme="teal" onClick={() => window.location.reload()}>
          Refresh Coupons
        </Button>
      </VStack>
    </Box>
  );
};

export default Coupons;
