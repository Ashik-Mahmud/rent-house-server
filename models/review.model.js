const mongoose = require("mongoose");
const validator = require("validator");


const reviewSchemaForHouse = new mongoose.Schema({
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
    isAccepted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


const ReviewsForHouse = mongoose.model("Reviews", reviewSchemaForHouse);
module.exports = {ReviewsForHouse};