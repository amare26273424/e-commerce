const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const axios = require('axios')

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = 'CHASECK_TEST-oFExyFD9t7GQn4d0B5OCoOolx0Ts0QjF' // || register to chapa and get the key



// req header with chapa secret key
const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`
    }
}



// initial payment endpoint
router.post("/paym", async (req, res) => {
         // chapa redirect you to this url when payment is successful
         const CALLBACK_URL = "http://localhost:5000/api/verify-payment/"
        const RETURN_URL = "http://localhost:3000/order/success"
        // a unique reference given to every transaction
        const TEXT_REF = "tx-myecommerce12345-" + Date.now()
        const orderData = JSON.parse(req.body.orderData);
        console.log(orderData)
        // form data
        const data = {
            amount: '50', 
            currency: 'ETB',
            email: 'ato@ekele.com',
            first_name: 'ama',
            last_name: 'Ekele',
            tx_ref: TEXT_REF,
            callback_url: CALLBACK_URL + TEXT_REF,
            return_url: RETURN_URL
        }
        // post request to chapa
        await axios.post(CHAPA_URL, data, config)
            .then((response) => {
                res.redirect(response.data.data.checkout_url)
            })
            .catch((err) => console.log(err))
})

// verification endpoint
router.get("/api/verify-payment/:id", async (req, res) => {
    
        //verify the transaction 
        await axios.get("https://api.chapa.co/v1/transaction/verify/" + req.params.id, config)
            .then((response) => {
                console.log("Payment was successfully verified")
            }) 
            .catch((err) => console.log("Payment can't be verfied", err))
})

// router.get("/api/payment-success", async (req, res) => {
//     res.render("success")
// })



module.exports = router;
