const mongoose = require("mongoose");
const validator = require("validator")

const reportHouseSchema = new mongoose.Schema({
    houseUrl: {
        type: String,
        required: true,
        validate: {
            validator: function(v){
                return validator.isURL(v);
            }
        }
    },
    reportTitle: {
        type: String,
        required: true,
        trim: true
    }, 
    reportDetails: {
        type: String,
        trim: true,
        required: true
    },
    house: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "House"
    }
})

const Report = new mongoose.model("reports", reportHouseSchema);

module.exports = Report;