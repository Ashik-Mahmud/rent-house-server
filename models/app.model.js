const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        trim: true,
    },
    favicon: {
        type: String,
        trim: true,
    },

}, {timestamps: true});

const AppOptions = mongoose.model("AppOptions", AppSchema);
module.exports = AppOptions;

