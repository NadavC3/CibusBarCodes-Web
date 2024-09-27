const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const crypto = require('crypto');
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config(); // Load environment variables from .env file


const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");


const connectionString = process.env.MONGODB_CONNECTION_STRING;


// Keep-alive endpoint
const jobObject = require('./cron.js');
const job = jobObject.job; // Access the 'job' property from the exported object
job.start();



const User = require("./Schemas/user");
const Coupon = require("./Schemas/coupon");


// mongoose.connect(connectionString, {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// })
mongoose.connect(connectionString)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((error)=> {
    console.error('Error connecting to MongoDB:', error)
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});






// Hash password and generate a random salt
const hashPassword = async (password) => {
   // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Hash the password with the generated salt
  const hashedPassword = crypto
  .createHash('sha256')
  .update(password + salt)
  .digest('hex');
  return { hashedPassword, salt };
}







app.post("/login",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"email or password are required"})
    }
    User.findOne({email}).then((user)=> {
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
         // Retrieve hashed password and salt from the database based on the provided username
        const storedHashedPassword = user.password;

        // Combine the received password from the login screen, with the stored salt
        const saltedPassword = password + user.salt;

         // Hash the combined password and salt
         const hashedPassword = crypto
            .createHash('sha256')
            .update(saltedPassword)
            .digest('hex');

        if(hashedPassword !== storedHashedPassword){
            return res.status(401).json({message:"wrong password"})
        }
        //const token = createToken(user._id);
        // Return the user ID upon successful login
        return res.status(200).json({ message: "Login successfully", userId: user._id });
    }).catch((error) => {
        console.log("Error finding user", error);
        return res.status(500).json({ message: "Server error" });
    });
});



app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const { hashedPassword, salt } = await hashPassword(password);
  
    const newUser = new User({
        email: email,
        password: hashedPassword,
        salt: salt,
    });
  
     // Check if the username or email is already in use
     const existingUser = await User.findOne({ $or: [{ email }] });
  
     if (existingUser) {
        const message = "Already existing Email";
        return res.status(400).json({ message });
    }

    newUser.save().then(() => {
        res.status(200).json({ message: "Registered user" });
    }).catch((error) => {
        console.log("error registering", error);
        res.status(500).json({ message: "Registration error" });
    });
  });


  app.post("/addCouponFromSMS", async (req, res) => {
    console.log('Adding coupon from SMS:');

    const {link, amount, acceptedAt, userId } = req.body;

    console.log('link = ',link);
    console.log('amount = ',amount);
    console.log('acceptedAt = ',acceptedAt);
    console.log('userId = ',userId);


    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const coupon = new Coupon({
        link: link,
        amount: amount,
        acceptedAt: acceptedAt,
    });

    // Check if the coupon already exists
    const existingCoupon = await Coupon.findOne({ link });
  
    if (existingCoupon) {
     let message;
     
     if (existingCoupon.link === link) {
       message = "Existing Coupon";
     }
   
     return res.status(400).json({ message });
   }

   try {
        const savedCoupon = await coupon.save();

        // Add the coupon reference to the user's coupons array
        user.coupons.push(savedCoupon._id);
        await user.save();

        res.status(200).json({ message: "Added coupon" });
    } catch (error) {
        console.log("error adding coupon", error);
        res.status(500).json({ message: "Adding coupon error" });
    }
});


app.get("/getUserCoupons/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by userId
        const user = await User.findById(userId).populate('coupons');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's coupons
        res.status(200).json({ coupons: user.coupons });
    } catch (error) {
        console.log("Error retrieving user coupons:", error);
        res.status(500).json({ message: "Error retrieving user coupons" });
    }
});


// app.delete('/coupons/:userId/:couponId', async (req, res) => {
//     const { userId, couponId } = req.params;
//     console.log("deleting coupon ",couponId," from userId ",userId);
//     try {
//       // Delete the coupon
//       await Coupon.findByIdAndDelete(couponId);
      
//       // Remove the reference from the user's coupons array
//       await User.findByIdAndUpdate(userId, {
//         $pull: { coupons: couponId }
//       });
  
//       res.status(200).send({ message: 'Coupon deleted successfully' });
//     } catch (error) {
//       res.status(500).send({ error: 'Failed to delete coupon' });
//     }
//   });

app.post('/coupons/delete', async (req, res) => {
    const { userId, couponId } = req.body; // Get the values from the request body
    console.log("deleting coupon ", couponId, " from userId ", userId);
    try {
      // Delete the coupon
      await Coupon.findByIdAndDelete(couponId);

      // Remove the reference from the user's coupons array
      await User.findByIdAndUpdate(userId, {
        $pull: { coupons: couponId }
      });

      res.status(200).send({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete coupon' });
    }
});



