/* Create Report Services */

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
exports.deleteReportService = async(id) =>{
    const result = await Report.findByIdAndDelete(id);
    return result;
}