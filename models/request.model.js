const mongoose = require("mongoose");
const { Schema } = mongoose;
const validate = require("validator");

const requestSchema = new Schema(
  {
    blogUrl: {
      type: String,
      trim: true,
      
    },
    notes: {
      type: String,
      trim: true,
      required: [true, "Notes cannot be empty"],
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: ["pending",  "approved"],
            message: '{VALUE} is not supported.'
        },
    },
    reqFor: {
        type: String,
        required: true,
        enum: {
            values: ["blog", "householder"],
            message: '{VALUE} is not supported.'
        }
    },

    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const Request = mongoose.model("request", requestSchema);
module.exports = Request;
