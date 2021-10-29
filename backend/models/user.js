const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Products = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    products: [Products],
  },
  {
    collection: "user-data",
  }
);

const user = mongoose.model("UserData", User);

module.exports = user;
