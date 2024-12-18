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
},
  isDeleted: {
    type: Boolean,
    default: false  // Defaults to "not deleted"
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;







