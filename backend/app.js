const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const user = require('./controller/user')
const admin= require('./controller/admin')
const shop= require('./controller/shop')
const order= require('./controller/order')
const product= require('./controller/product')
const event= require('./controller/event')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static('uploads'));
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin of your React application
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}


// import routes




app.use("/api/v2/order", order);
app.use("/api/v2/user", user);
app.use("/api/v2/admin", admin);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
