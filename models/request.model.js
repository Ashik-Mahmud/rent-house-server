const mongoose = require("mongoose");
const { Schema } = mongoose;
const validate = require("validator");

const requestSchema = new Schema(
  {
    blogUrl: {
      type: String,
      trim: true,
      validate: [validate.isURL, "Invalid URL"],
    },
    notes: {
      type: String,
      trim: true,
      required: [true, "Notes cannot be empty"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    }, // pending
    author: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Request = mongoose.model("request", requestSchema);
module.exports = Request;
