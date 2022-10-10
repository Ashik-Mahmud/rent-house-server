
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: mongoose.ObjectId,
            ref: "comment"
        }
    ],
    available: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});
 
const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;