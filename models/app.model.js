const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema({
    name: {
        type: String,
        trim: true,
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

const AppOption = mongoose.model("options", AppSchema);
module.exports = AppOption;

