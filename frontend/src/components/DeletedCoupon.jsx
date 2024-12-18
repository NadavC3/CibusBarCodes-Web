import { Box, VStack, Heading, Text, Spinner, Grid, Button, Modal, Image, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, useDisclosure, useToast, Textarea, Select, IconButton, 
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useColorModeValue } from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import { controllerFetchCoupons, controllerDeleteCouponFromDB, controllerRestoreCoupon } from "../controllers/CouponsController";
import acceptedPlaceIcons from "./acceptedPlaceIcons";
import { DeleteIcon } from "@chakra-ui/icons"; 

// eslint-disable-next-line react/prop-types
const Coupons = ({ userId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const { isOpen: isAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isRestoredOpen, onOpen: onRestoredOpen, onClose: onRestoredClose } = useDisclosure(); // For confirming coupon restore
  const [selectedPlace, setSelectedPlace] = useState('all'); 
  const [filteredCoupons, setFilteredCoupons] = useState([]); 
  const [placesList, setPlacesList] = useState([]); 
  const [couponToDelete, setCouponToDelete] = useState(null); // Track the coupon to delete manually
  const [couponToRestore, setCouponToRestore] = useState(null); // Track the coupon opened by the user
  const toast = useToast();
  const cancelRef = useRef();
  const bgColor = useColorModeValue("white", "black");

  useEffect(() => {
    const fetchCoupons = async () => {
      const result = await controllerFetchCoupons(userId);
      if (result.success) {
        const validCoupons = result.data.filter(coupon => coupon.isDeleted === true);
        setCoupons(validCoupons);
        setPlacesList(generatePlacesList(validCoupons)); 
        setFilteredCoupons(validCoupons); 
      } else {
        setErrorMessage(result.message);
      }
      setLoading(false);
    };

    fetchCoupons();
  }, [userId]);

  

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
        const status = await controllerDeleteCouponFromDB(userId, couponToDelete);
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

  const confirmRestoreCoupon = async() => {
    if (couponToRestore) {
      try {
        const status = await controllerRestoreCoupon(userId, couponToRestore);
        if (status === 200) {
          toast({
            title: "Coupon restored.",
            description: "The coupon was restored successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setCoupons(coupons.filter(coupon => coupon._id !== couponToRestore));
          setFilteredCoupons(filteredCoupons.filter(coupon => coupon._id !== couponToRestore));
        }
      } catch (error) {
        toast({
          title: "Error restoring coupon.",
          description: error.response.data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      onRestoredClose();
      setCouponToRestore(null);
    }
  };

  const handleCouponClick = async (coupon) => {
    setCouponToRestore(coupon); 
    onRestoredOpen(); // Open the restore confirmation dialog
  };


  return (
    <Box minH="100vh" bg={useColorModeValue("gray.200", "gray.900")} py={10}>
      <VStack spacing={6} alignItems="center" maxW="container.md" mx="auto" px={6}>
        <Heading as="h1" size="lg" color="red.700" mb={4}>
          Deleted Coupons
        </Heading>
  
        {/* Filtering */}
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
                as="button"
                onClick={() => handleCouponClick(coupon)} // Restore the deleted coupon
              >
                <Text fontWeight="bold" fontSize="lg">
                  {coupon.company}
                </Text>
                <Text fontSize="xl" textAlign="center" fontWeight="bold">
                  ₪{coupon.amount}
                </Text>
  
                {/* Image or text for accepted place */}
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
  
                {/* Date of delete */}
                <Text fontSize="xl" textAlign="center" fontWeight="bold">
                  {new Date(coupon.deletedAt).toLocaleDateString('en-GB').replace(/\//g, '/')}
                </Text>
  
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
          </ModalContent>
        </Modal>
  
        {/* Permenant delete Coupon Dialog */}
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
  
        {/* Restore Coupon Dialog */}
        <AlertDialog
          isOpen={isRestoredOpen}
          leastDestructiveRef={cancelRef}
          onClose={onRestoredClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Restore coupon?
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Do you want to restore this coupon? Restored coupons will become active again.
              </AlertDialogBody>

             <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onRestoredClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={confirmRestoreCoupon} ml={3}>
                Restore
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </VStack>
    </Box>
  );
}

export default Coupons;
