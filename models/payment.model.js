const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: "user",
    },
    author: {
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
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bankTransactionId: {
      type: String,
      trim: true,
      unique: true,
    },
    money: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "booked", "canceled"],
    },
  },
  {
    timestamps: true,
  }
);
const Bookings = mongoose.model("bookings", PaymentSchema);

module.exports = Bookings;
