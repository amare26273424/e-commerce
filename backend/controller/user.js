const express = require("express");
const app =express();
const path = require('path')
const fs = require('fs')
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const secretKey = 'PWj0fI#&2345DsZY9w$8tHe11*yr9F45K*j2xj&fceGZ!tEnMNZcEN'
const User = require('../model/user');
const upload  = require('../multer')
const  sendMail = require('../utils/sendmailer')
const { isAuthenticated} = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cors = require("cors");

app.use(cors());






router.post("/create-user",upload.single('file'), async (req, res, next) => {
  try {
    const { name, email, password} = req.body;
    const avatar = req.file;
    const userEmail = await User.findOne({ email });
   

    if (userEmail) {   
      fs.unlinkSync(path.join(__dirname, '../', avatar.path));
      return next(new ErrorHandler("User already exists", 400));
    }



    const user = {
      name: name,
      email: email,
      password: password,    
      avatar:avatar.filename
    };

    const activationToken =await  createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, secretKey, {
    expiresIn: "5m",
  });
};








// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        secretKey
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");
   
      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }
    sendToken(user, 201, res);
     
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {

      const user = await User.findById(req.user.id);
    
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;