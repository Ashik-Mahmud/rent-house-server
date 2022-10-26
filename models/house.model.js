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
        values: ["Bungalow", "Duplex", "Flat", "Terrace", "General"],
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
      img: {
        type: String,
        required: [true, "Please enter house image"],
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    gallery: [
      {
        image: {
          type: String,
          required: [true, "Please enter house image"],
        },
        public_id: {
          type: String,
          required: true,
        },
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
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    bookedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    isAvailable: {
      type: String,
      enum: ["Yes", "No"],
    },
    isBooked: {
      type: String,
      enum: ["Yes", "No"],
    },
    isBachelorRoom: {
      type: String,
      enum: ["Yes", "No"],
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
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    allowReview: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    totalReviews: {
      type: Number,
      trim: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
      trim: true,
    },
    totalReports: {
      type: Number,
      default: 0,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
