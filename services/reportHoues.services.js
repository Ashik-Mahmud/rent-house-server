/* Create Report Services */

const Report = require("../models/reportHouse.model")


exports.createReportServices = async(data) =>{
    const result = await Report.create(data);
    return result;
}