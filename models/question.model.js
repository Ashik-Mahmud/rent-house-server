const mongoose = require("mongoose");
const validator = require("validator");

const questionSchema = new mongoose.Schema(
    {
        house: {
            type: mongoose.Schema.ObjectId,
            ref: "House",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxLength: [30, "Name cannot exceed 30 characters"],
        },
        phone: {
            type: String,
            required: [true, "Please enter your phone number"],
            trim: true,
            maxLength: [30, "Phone number cannot exceed 30 characters"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Please enter your email"],
            validate: {
                validator: function (v) {
                    return validator.isEmail(v);
                }
            }
        },
        question: {
            type: String,
            required: [true, "Please enter your question"],
            trim: true,
            maxLength: [500, "Question cannot exceed 500 characters"],
        },
    },
    {
        timestamps: true,
    }
);

const questions = mongoose.model("Question", questionSchema);

module.exports = questions;