const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },

  coupons: [{
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
