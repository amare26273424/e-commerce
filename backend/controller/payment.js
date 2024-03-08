const Order = require("../model/order");
const express = require("express");
const router = express.Router();
const axios = require('axios')

const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = 'CHASECK_TEST-oFExyFD9t7GQn4d0B5OCoOolx0Ts0QjF' // || register to chapa and get the key



// req header with chapa secret key
const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`
    }
}

// const decline_URL = "http://localhost:3000/decline"

// initial payment endpoint
router.post("/pay", async (req, res) => {
         // chapa redirect you to this url when payment is successful
        const CALLBACK_URL = "http://localhost:4400/verify-payment/"
        const RETURN_URL = "http://localhost:3000/order/success"
     
        // a unique reference given to every transaction
        const TEXT_REF = "tx-myecommerce12345-" + Date.now()
        const orderData = JSON.parse(req.body.orderData);
        // console.log(orderData)
        // form data
        const data = {
            amount: orderData.totalPrice, 
            currency: 'ETB',
            email: orderData.user.email,
            orderData:orderData,
             callback_url: CALLBACK_URL + TEXT_REF,
            return_url: RETURN_URL
        }
        // post request to chapa
        await axios.post(CHAPA_URL, data, config)
        .then((response) => {
            res.redirect(response.data.data.checkout_url);
            console.log(response.config.data.orderData.paymentInfo)
        })
        .catch((err) => {
            console.log(err.message);
            res.redirect("http://localhost:3000/decline");
        });
    
}) 


// verification endpoint
// router.get("/verify-payment/:id", async (req, res) => {
//     try {
//         // Verify the transaction 
//         const verifyResponse = await axios.get("https://api.chapa.co/v1/transaction/verify/" + req.params.id, config);
//         console.log(verifyResponse)
//         // Check if payment was successfully verified
//         // if (verifyResponse.data.success) {
//         //     console.log(verifyResponse )
//             // Extract payment details from verification response
//             // const { cart, shippingAddress, user, totalPrice, paymentInfo } = verifyResponse.data.data;

//             // Create an order using the extracted payment details
//             // const order = await Order.create({
//             //     cart,
//             //     shippingAddress,
//             //     user,
//             //     totalPrice,
//             //     paymentInfo
//             // });

//             // console.log("Order created successfully");
//             // res.status(201).json({ success: true, order });
//         // } else {
//         //     console.log("Payment verification failed");
//         //     res.status(400).json({ error: "Payment verification failed" });
//         // }
//     } catch (error) {
//         console.error("Error verifying payment:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


module.exports = router;

// router.get("/api/payment-success", async (req, res) => {
//     res.render("success")
// })