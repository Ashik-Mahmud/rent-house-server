const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppReviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});

const appReview = mongoose.model('AppReview', AppReviewSchema);
module.exports = appReview;
