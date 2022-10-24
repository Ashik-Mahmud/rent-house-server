/* Schema And Model for Register Users */
const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    address: {
      type: String,
      trim: 0,
    },
    phone: {
      type: String,
      trim: 0,
      /* minLength: [11, "Phone must be at least 11 characters"], */
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "customer", "manager"],
    },
    facebookLink: {
      type: String,
      trim: true,
    },
    twitterLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isURL(v);
        },
      },
    },
    instagramLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isURL(v);
        },
      },
    },
    avatar: {
      type: String,
      default:
        "https://assets.webiconspng.com/uploads/2016/11/avatar_business_costume_male_man_office_user_icon_403022.png",
      validate: {
        validator: function (v) {
          return validator.isURL(v);
        },
      },
    },
    profileImage: {
      type: String,
      trim: true,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    blogAllowed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    isBlogRequestSent: {
      type: Boolean,
      default: false,
    },
    isHouseHolderReqSent: {
      type: Boolean,
      default: false,
    },
    cloudinaryId: {
      type: String,
      default: null,
    },
    bookedHouses: [
      {
        type: mongoose.ObjectId,
        ref: "House",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
