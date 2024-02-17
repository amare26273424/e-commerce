const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect('mongodb+srv://amarehagos26273424:26273424@mernproject.ww2aaqx.mongodb.net/E-commerce?retryWrites=true&w=majority')
    .then((data) => {
      console.log(`mongod connected with server:`);
    });
};

module.exports = connectDatabase;
