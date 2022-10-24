const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: "user",
  },
  house: {
    type: mongoose.ObjectId,
    required: true,
    ref: "House",
  },
  method: {
    type: String,
    required: true,
    enum: ["SSLCOMMERZ", "Stripe"],
  },
  transactionId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "booked", "canceled"],
  },
});


