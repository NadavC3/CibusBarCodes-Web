import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter,} from 'react-router-dom';

import AppRoutes from "./AppRoutes";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Box
          display="flex"
          flexDirection="column"  
          width="100vw"  // Full viewport width
          height="100vh"  // Full viewport height
        >
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
