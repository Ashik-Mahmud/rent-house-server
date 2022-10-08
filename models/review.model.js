const mongoose = require("mongoose");
const validator = require("validator");

const reviewSchema = new mongoose.Schema({
    author: {
        type: Object,
        required: true
    
    },
    rating: {
        type: Number,
        required: [true, "Please enter house rating"],
        min: [1, "Rating must be at least 1.0"],
        max: [5, "Rating must cannot exceed 5.0"],
    },
    content: {
        type: String,
        required: [true, "Please enter house comment"],
    },
})

const reviewSchemaForHouse = new mongoose.Schema({
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
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            }
        }
    },
    rating: {
        type: Number,
        required: [true, "Please enter house rating"],
        min: [1, "Rating must be at least 1.0"],
        max: [5, "Rating must cannot exceed 5.0"],
    },
    comment: {
        type: String,
        required: [true, "Please enter house comment"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Reviews = mongoose.model("reviews", reviewSchema);
const ReviewsForHouse = mongoose.model("Reviews", reviewSchemaForHouse);
module.exports = {Reviews, ReviewsForHouse};