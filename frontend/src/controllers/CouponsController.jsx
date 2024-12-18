/* eslint-disable no-unused-vars */
import axios from 'axios';
import config from '../config';

const controllerFetchCoupons  = async (userId) => {
    try {
        const response = await axios.get(`${config.baseUrl}/getUserCoupons/${userId}`);
        return { success: true, data: response.data.coupons };
      } catch (error) {
        return { success: false, message: 'Failed to fetch coupons.' };
      }
    };


const addCouponFromSMS = async (smsMessage,userId) => {
  const amountRegex = /בסך ₪([\d.,]+)/;
  const companyRegex = /שובר\s*([\w\u0590-\u05FF]+)/;
  const urlRegex = /(https?:\/\/[^\s]+)/;


  // Match amount and company
  const amountMatch = smsMessage.match(amountRegex);
  const companyMatch = smsMessage.match(companyRegex);
  const urlMatch = smsMessage.match(urlRegex);

  console.log("amountMatch = ",amountMatch);
  console.log("companyMatch = ",companyMatch);
  console.log("urlMatch = ",urlMatch);


  if (!amountMatch || !companyMatch || !urlMatch) {
    throw new Error('SMS format not recognized');
  }

  // Extract amount, company, and link
  const amount = parseFloat(amountMatch[1].replace(',', ''));
  const company = companyMatch[1].trim();
  const link = urlMatch ? urlMatch[1] : '';

  // Construct coupon object
  const coupon = {
    link: link,
    amount: amount,
    acceptedAt: company,
    userId: userId
  };
  try {
    const res = await axios.post(`${config.baseUrl}/addCouponFromSMS`, coupon);
    return res.data.message;;
  } catch (error) {
    // Check if the error has a response from the server
    if (error.response) {
      // Extract the message from the error response
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      // Any other errors
      throw new Error('An error occurred while adding the coupon: ' + error.message);
    }
  }
}


  // Changes the coupon to deleted
const controllerDeleteCoupon = async (userId, couponId) => {
  console.log("couponId to delete = ", couponId);
  try {
    const response = await axios.post(`${config.baseUrl}/coupons/delete`, {
      userId,
      couponId
    });
    console.log(response);
    return response.status;
  } catch (error) {
    console.log("Error in deleting coupon has occurred", error);
  }
};

 // Changes the coupon to not deleted
 const controllerRestoreCoupon = async (userId, couponId) => {
  console.log("couponId to restore = ", couponId);
  try {
    const response = await axios.post(`${config.baseUrl}/coupons/restore`, {
      userId,
      couponId
    });
    console.log(response);
    return response.status;
  } catch (error) {
    console.log("Error in restoring coupon has occurred", error);
  }
};


// A full delete of the coupon from the DB
const controllerDeleteCouponFromDB = async (userId, couponId) => {
  console.log("couponId to delete = ", couponId);
  try {
    const response = await axios.post(`${config.baseUrl}/coupons/permanentDelete`, {
      userId,
      couponId
    });
    console.log(response);
    return response.status;
  } catch (error) {
    console.log("Error in deleting coupon has occurred", error);
  }
};





export { controllerFetchCoupons, addCouponFromSMS, controllerDeleteCoupon, controllerDeleteCouponFromDB, controllerRestoreCoupon };
