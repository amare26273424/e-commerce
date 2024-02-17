const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const user = require('./controller/user')
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





app.use("/api/v2/user", user);
// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
