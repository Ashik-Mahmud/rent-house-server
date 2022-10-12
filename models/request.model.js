const mongoose = require("mongoose");
const { Schema } = mongoose;
const validate = require("validator");

const blogRequestSchema = new Schema(
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
    
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const BlogRequest = mongoose.model("blogRequest", blogRequestSchema);
module.exports = BlogRequest;
