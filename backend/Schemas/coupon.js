const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  link: { 
    type: String, 
    required: true, 
    unique: true 
},
  amount: { 
    type: Number, 
    required: true 
},
  expirationDate: { 
    type: Date 
},
  acceptedAt: { 
    type: String 
}
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;







