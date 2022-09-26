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
    category: {
      type: String,
      required: [true, "Please enter house type"],
      enum: {
        values: ["Bungalow", "Duplex", "Flat", "Terrace"],
        message: "Please select correct house type for house",
      },
    },
    houseType: {
      type: String,
      required: [true, "Please enter house type"],
      enum: {
        values: ["Rent", "Sale"],
        message: "Please select correct house type for house",
      },
    },
    houseUseFor: {
      type: String,
      required: [true, "Please enter house use for"],
      enum: {
        values: ["Residential", "Commercial"],
        message: "Please select correct house use for",
      },
    },
    price: {
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
    others: {
      hasDrawingRoom: {
        type: Boolean,
        default: false,
      },
      hasDinningRoom: {
        type: Boolean,
        default: false,
      },
      hasKitchen: {
        type: Boolean,
        default: false,
      },
      hasStore: {
        type: Boolean,
        default: false,
      },
      hasServantRoom: {
        type: Boolean,
        default: false,
      },
      hasSwimmingPool: {
        type: Boolean,
        default: false,
      },
      hasGym: {
        type: Boolean,
        default: false,
      },
      hasLawn: {
        type: Boolean,
        default: false,
      },
      hasGarage: {
        type: Boolean,
        default: false,
      },
      hasCarParking: {
        type: Boolean,
        default: false,
      },
      hasLift: {
        type: Boolean,
        default: false,
      },
      hasGenerator: {
        type: Boolean,
        default: false,
      },
      hasSecurity: {
        type: Boolean,
        default: false,
      },
      hasCCTV: {
        type: Boolean,
        default: false,
      },
      hasInternet: {
        type: Boolean,
        default: false,
      },
      hasGas: {
        type: Boolean,
        default: false,
      },
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
            return validator.isURL(value);
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
    googleMapLocation: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Please enter valid google map location",
      },
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    isBachelorRoom: {
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
    allowQuestion: {
        type: Boolean,
        default: true,
    },
    allowReview: {
        type: Boolean,
        default: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
