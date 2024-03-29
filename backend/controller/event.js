const express = require("express");
const { isSeller } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Event = require("../model/event");
// const Order = require("../model/order");
const Shop = require("../model/shop");
const upload = require('../multer')
// const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
  "/create-event",upload.array('images'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.body)
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
    
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
       

        const files = await req.files;      
        const imageurl =await  files.map((file)=> file.filename)

        const eventData = req.body;
        eventData.images = imageurl;
        eventData.shop = shop;

        const event = await Event.create(eventData);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      console.log(`error is ${error}`)
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events of a shop
   router.get(
     "/get-all-events-shop/:id",
     catchAsyncErrors(async (req, res, next) => {
       try {
         const events = await Event.find({ shopId: req.params.id });
         res.status(201).json({
           success: true,
           events,
         });
       } catch (error) {
         return next(new ErrorHandler(error, 400));
       }
     })
   );

// delete product of a shop
 router.delete(
   "/delete-shop-event/:id",
   isSeller,
   catchAsyncErrors(async (req, res, next) => {
     try {
      const event = await Event.findOneAndDelete({ _id: req.params.id});;    
      if (!event) {
        return next(new ErrorHandler("event is not found with this id", 404));
      }         
      
      res.status(201).json({
        success: true,
        message: "event Deleted successfully!",
      });
     } catch (error) {
       return next(new ErrorHandler(error, 400));
     }
   })
 );

// get all products
 router.get(
   "/get-all-events",
   catchAsyncErrors(async (req, res, next) => {
     try {
       const events = await Event.find().sort({ createdAt: -1 });
    
       res.status(201).json({
         success: true,
         events,
       });
     } catch (error) {
       return next(new ErrorHandler(error, 400));
     }
   })
 );

// review for a product
// router.put(
//   "/create-new-review",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { user, rating, comment, productId, orderId } = req.body;

//       const product = await Product.findById(productId);

//       const review = {
//         user,
//         rating,
//         comment,
//         productId,
//       };

//       const isReviewed = product.reviews.find(
//         (rev) => rev.user._id === req.user._id
//       );

//       if (isReviewed) {
//         product.reviews.forEach((rev) => {
//           if (rev.user._id === req.user._id) {
//             (rev.rating = rating), (rev.comment = comment), (rev.user = user);
//           }
//         });
//       } else {
//         product.reviews.push(review);
//       }

//       let avg = 0;

//       product.reviews.forEach((rev) => {
//         avg += rev.rating;
//       });

//       product.ratings = avg / product.reviews.length;

//       await product.save({ validateBeforeSave: false });

//       await Order.findByIdAndUpdate(
//         orderId,
//         { $set: { "cart.$[elem].isReviewed": true } },
//         { arrayFilters: [{ "elem._id": productId }], new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Reviwed succesfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// all products --- for admin
// router.get(
//   "/admin-all-products",
//   isAuthenticated,
//   isAdmin("Admin"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.find().sort({
//         createdAt: -1,
//       });
//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );
module.exports = router;
