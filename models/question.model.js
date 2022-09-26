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
        question: {
            type: String,
            required: [true, "Please enter your question"],
            trim: true,
            maxLength: [500, "Question cannot exceed 500 characters"],
        },
        answer: {
            type: String,
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