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
      if (!res.data) {
        throw new Error('Failed to add coupon');
      }
      return res.data;
    } catch (error) {
      console.log('Error adding coupon:', error);
    }
  };



  const controllerDeleteCoupon = async (userId, couponId) => {
    try {
      const response = await axios.delete(`/coupons/${userId}/${couponId}`);
      return response.status;
    } catch(error) {
      console.log("Error in deleting coupon has occurred",error);
    }
  }

export { controllerFetchCoupons, addCouponFromSMS, controllerDeleteCoupon };
