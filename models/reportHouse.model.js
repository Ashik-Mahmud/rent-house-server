const mongoose = require("mongoose");
const validator = require("validator");

const reportHouseSchema = new mongoose.Schema({
  houseUrl: {
    type: String,
    required: true,
    trim: true,
  },
  reportType: {
    type: String,
    required: true,
    trim: true,
  },
  reportMessage: {
    type: String,
    trim: true,
    required: true,
  },
  houseHolder: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user"
  },
  house: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "House",
  },
});

const Report = new mongoose.model("reports", reportHouseSchema);

module.exports = Report;
