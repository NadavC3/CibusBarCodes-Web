import axios from 'axios';
import config from '../config';



const controllerHandleLogin = async (email, password) => {
    const user = { email, password };


    try {
        const res = await axios.post(`${config.baseUrl}/login`, user);
        const userId = res.data.userId;
        console.log("User logged in successfully");
        return { userId, message: res.data.message };
    } catch (error) {
        console.error("Error during login:", error);
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        return { userId: null, message: errorMessage };
    }
};



export {controllerHandleLogin};
