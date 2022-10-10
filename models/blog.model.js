
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
    imageUrl: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: mongoose.ObjectId,
            ref: "comment"
        }
    ],
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
}, {
    timestamps: true
});
 
const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;