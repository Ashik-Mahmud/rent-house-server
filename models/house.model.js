const mongoose = require("mongoose");
const validator = require("validator");
const houseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter house name"],
      trim: true,
      maxLength: [100, "House name cannot exceed 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Please enter house address"],
    },
    pricePerMonth: {
      type: Number,
      required: [true, "Please enter house price per month"],
      maxLength: [4, "House price per month cannot exceed 4 characters"],
      default: 0.0,
    },
    bedrooms: {
      type: Number,
      required: [true, "Please enter number of bedrooms"],
      minLength: [1, "Number of bedrooms cannot be less than 1"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Please enter number of bathrooms"],
      minLength: [1, "House price cannot be less than 1"],
    },
    description: {
      type: String,
      required: [true, "Please enter house description"],
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            if (!Array.isArray(value) || value.length > 5) {
              return false;
            }
            let isValid = true;
            value.forEach((image) => {
              if (!validator.isURL(image)) {
                isValid = false;
              }
            });
            return isValid;
          },
        },
        message: "Please enter valid image URLs",
      },
    ],
    district: {
      type: String,
      required: [true, "Please enter house District"],
    },
    city: {
      type: String,
      required: [true, "Please enter house City"],
    },
    owner: {
      id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: [true, "Please enter owner name"],
      },
      email: {
        type: String,
        required: [true, "Please enter owner email"],
        validate: {
          validator: function (value) {
            return validator.isEmail(value);
          },
        },
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Please select correct status for house",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("House", houseSchema);
