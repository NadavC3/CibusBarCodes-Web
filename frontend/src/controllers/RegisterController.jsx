import axios from 'axios';
import config from '../config';

const controllerHandleRegister = async (email, password) => {
  try {
    const response = await axios.post(`${config.baseUrl}/register`, {
      email,
      password,
    });

    console.log('Registration successful:', response.data.message);
    return { success: true, message: response.data.message };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Return the error message from the server
      return { success: false, message: error.response.data.message };
    } else {
      // Return a generic error message
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }
};

export {controllerHandleRegister};



