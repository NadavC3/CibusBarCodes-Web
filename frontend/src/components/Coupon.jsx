import { Box, VStack, Heading, Text, Spinner, Grid, Button, Modal, Image, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, useToast, Link, Textarea, Select, IconButton, 
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { controllerFetchCoupons, addCouponFromSMS, controllerDeleteCoupon } from "../controllers/CouponsController";
import acceptedPlaceIcons from "./acceptedPlaceIcons";
import { DeleteIcon } from "@chakra-ui/icons"; 

// eslint-disable-next-line react/prop-types
const Coupons = ({ userId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isUsedOpen, onOpen: onUsedOpen, onClose: onUsedClose } = useDisclosure(); // For confirming coupon usage
  const [selectedPlace, setSelectedPlace] = useState('all'); 
  const [filteredCoupons, setFilteredCoupons] = useState([]); 
  const [placesList, setPlacesList] = useState([]); 
  const [couponToDelete, setCouponToDelete] = useState(null); // Track the coupon to delete manually
  const [couponToCheck, setCouponToCheck] = useState(null); // Track the coupon opened by the user
  const toast = useToast();
  const cancelRef = useRef();
  const bgColor = useColorModeValue("white", "black");

  useEffect(() => {
    const fetchCoupons = async () => {
      const result = await controllerFetchCoupons(userId);
      if (result.success) {
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
      onAddClose();
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
      setFilteredCoupons(coupons); 
    } else {
      const filtered = coupons.filter(coupon => coupon.acceptedAt.toLowerCase() === place.toLowerCase());
      setFilteredCoupons(filtered);
    }
  };

  const confirmDeleteCoupon = async () => {
    if (couponToDelete) {
      try {
        const status = await controllerDeleteCoupon(userId, couponToDelete);
        if (status === 200) {
          toast({
            title: "Coupon deleted.",
            description: "The coupon was deleted successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setCoupons(coupons.filter(coupon => coupon._id !== couponToDelete));
          setFilteredCoupons(filteredCoupons.filter(coupon => coupon._id !== couponToDelete));
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
      onDeleteClose();
      setCouponToDelete(null);
    }
  };

  const handleCouponClick = (coupon) => {
    setCouponToCheck(coupon); 
    window.open(coupon.link, '_blank');
    onUsedOpen(); // Open the usage confirmation dialog
  };

  const handleConfirmUsed = async () => {
    if (couponToCheck) {
      try {
        await controllerDeleteCoupon(userId, couponToCheck._id);
        setCoupons(coupons.filter(coupon => coupon._id !== couponToCheck._id));
        setFilteredCoupons(filteredCoupons.filter(coupon => coupon._id !== couponToCheck._id));
        toast({
          title: "Coupon marked as used.",
          description: "The coupon was deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error deleting coupon.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onUsedClose();
  };


  const handleCloseAddModal = () => {
    setSmsMessage(''); // Clear the SMS message input
    onAddClose(); 
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.200", "gray.900")} py={10}>
      <VStack spacing={6} alignItems="center" maxW="container.md" mx="auto" px={6}>
        <Heading as="h1" size="lg" color="teal.500" mb={4}>
          My Coupons
        </Heading>

        {/*Filtering*/}
        <Select 
          value={selectedPlace} 
          onChange={handleFilterChange}
          borderWidth="2px" 
          borderColor="blue.500" 
          borderRadius="md"
          bg={useColorModeValue("white", "gray.900")} 
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
            {filteredCoupons.map((coupon, index) => (
              <Box
                key={index}
                bg={bgColor}
                p={5}
                shadow="md"
                rounded="md"
                borderWidth="1px"
                transition="0.2s"
                _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                position="relative"
              >
                <Link
                  href={coupon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ textDecoration: "none" }}
                  onClick={() => handleCouponClick(coupon)} // Handle when a coupon is clicked
                >
                  <Text fontWeight="bold" fontSize="lg">
                    {coupon.company}
                  </Text>
                  <Text fontSize="xl" textAlign={"center"} fontWeight="bold">
                    ₪{coupon.amount}
                  </Text>

                  {/*Image or text for accepted place*/}
                  {acceptedPlaceIcons[coupon.acceptedAt.toLowerCase()] ? (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                      <Image
                        src={acceptedPlaceIcons[coupon.acceptedAt.toLowerCase()]}
                        alt={`${coupon.acceptedAt} icon`}
                        boxSize="80px"
                      />
                    </Box>
                  ) : (
                    <Text fontSize="md" fontWeight="bold" textAlign="center" mt={2}>
                      {coupon.acceptedAt}
                    </Text>
                  )}

                </Link>

                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="red"
                  aria-label="Delete"
                  fontSize="20px"
                  icon={<DeleteIcon />}
                  onClick={(event) => {
                    event.stopPropagation();
                    setCouponToDelete(coupon._id);
                    onDeleteOpen();
                  }}
                  position="absolute"
                  top="10px"
                  right="10px"
                />
              </Box>
            ))}
          </Grid>
        )}

        <Button 
          mt={6} 
          colorScheme="teal" 
          onClick={onAddOpen} 
        >
          Add Coupon from SMS
        </Button>
        <Button 
          mt={6} 
          colorScheme="teal" 
          onClick={() => window.location.reload()}
          >
            Refresh Coupons
        </Button>

        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Coupon from SMS</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={smsMessage}
                onChange={(event) => setSmsMessage(event.target.value)}
                placeholder="Enter SMS message"
                size="lg"
                rows={5}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleAddCoupon} isDisabled={!smsMessage}>
                Add Coupon
              </Button>
              <Button ml={3} onClick={handleCloseAddModal}> 
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Coupon Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Coupon
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this coupon? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteCoupon} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Used Coupon Dialog */}
        <AlertDialog
          isOpen={isUsedOpen}
          leastDestructiveRef={cancelRef}
          onClose={onUsedClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Coupon Used?
              </AlertDialogHeader>

              <AlertDialogBody>
                Did you use this coupon?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onUsedClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleConfirmUsed} ml={3}>
                  Yes, I used it
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};

export default Coupons;
