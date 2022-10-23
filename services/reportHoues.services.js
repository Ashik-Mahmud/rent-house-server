/* Create Report Services */

const House = require("../models/house.model");
const Report = require("../models/reportHouse.model")


exports.createReportServices = async(data) =>{
    const result = await Report.create(data);
    return result;
}

/* Reports By House ID Services */
exports.reportsForHouseService = async(id) =>{
    const result = await Report.find({house: id});
    return result;
}

/* Delete Report Services */
exports.deleteReportService = async(id, houseId) =>{
    const result = await Report.findByIdAndDelete(id);
    const house = await House.findById(houseId)
    if(house.totalReports > 0){
        house.totalReports = house.totalReports - 1;
        await house.save();
    }
    return result;
}