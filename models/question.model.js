const mongoose = require("mongoose");
const validator = require("validator");

const questionSchema = new mongoose.Schema(
    {
        house: {
            type: mongoose.Schema.ObjectId,
            ref: "House",
            required: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true,
        },
        question: {
            type: String,
            required: [true, "Please enter your question"],
            trim: true,
            maxLength: [500, "Question cannot exceed 500 characters"],
        },
        answer: {
            type: String,
            default: "none",
            trim: true,
        },
        accepted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const questions = mongoose.model("Question", questionSchema);

module.exports = questions;