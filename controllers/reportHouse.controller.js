// @routes POST api/v1/report-house/create
// @desc Public can create report for the House.
// @access private

const House = require("../models/house.model");
const { findByIdHouseService } = require("../services/house.services");
const { createReportServices, reportsForHouseService } = require("../services/reportHoues.services");
const { sendReportEmail } = require("../utils/sendEmail");

const createReport = async(req, res) =>{
    
    const {houseId, houseUrl, reportTitle, reportDetails} = req.body;
    const ownerInfo = await House.findById(houseId).populate("owner", "email").select('owner');
    const houseHolderEmail = ownerInfo?.owner.email;
    
    
    if(!houseUrl || !reportTitle || !reportDetails){
        return res.status(404).send({
            success: false,
            message: "All fields are required."
        })
    }
    try{
        const reports = await createReportServices({...req.body, house: houseId});
        res.status(201).send({
            success: true,
            message: "Report Added successfully.",
            data: reports
        })
        sendReportEmail(houseHolderEmail, houseUrl, reportTitle, reportDetails);
    }catch(err){
        res.status(404).send({
            success: false,
            message: "Server Error"+ err.message
        })
    }
}


// @routes GET api/v1/report-house/reports-by-house
// @desc Get All the Reports for particular House
// @access Private

const reportsForHouse = async(req, res) =>{
    const houseId = req.params.id;
    try {
        const reports = await reportsForHouseService(houseId)
        res.status(201).send({
            success: true,
            message: "Founds Reports by This ID",
            data: reports
        })
    } catch (error) {
        res.status(404).send({
            success: true,
            message: "server error"
        })
    }

}


module.exports = {createReport, reportsForHouse}