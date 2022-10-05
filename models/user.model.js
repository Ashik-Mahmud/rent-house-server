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
      maxLength: [30, "Address cannot exceed 30 characters"],
      minLength: [3, "Address must be at least 3 characters"],
    },
    phone: {
      type: String,
      trim: 0,
      minLength: [11, "Phone must be at least 11 characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    facebookLink: {
        type: String,
        validate: {
            validator: function (v) {
              return validator.isURL(v);
            },
          },
    },
    twitterLink: {
        type: String,
        validate: {
            validator: function (v) {
              return validator.isURL(v);
            },
          },
    },
    instagramLink: {
        type: String,
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
