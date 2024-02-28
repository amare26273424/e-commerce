const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your event description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your event category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event price!"],
  },
  start_Date: {
    type: Date,
    required: [true, "Please enter your event start date!"],
  },
  Finish_Date: {
    type: Date,
    required: [true, "Please enter your event finish date!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your event stock!"],
  },
  images: [
   
       {
         type: String
        }
  ]
  ,
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("event", eventSchema);
