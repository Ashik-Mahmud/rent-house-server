// @routes POST api/v1/report-house/create
// @desc Public can create report for the House.
// @access private

const House = require("../models/house.model");
const { findByIdHouseService } = require("../services/house.services");
const {
  createReportServices,
  reportsForHouseService,
  deleteReportService,
} = require("../services/reportHoues.services");
const { sendReportEmail } = require("../utils/sendEmail");

const createReport = async (req, res) => {
  const { house, houseUrl, reportType, reportMessage } = req.body;

  const ownerInfo = await House.findById(house)
    .populate("owner", "email")
    .select("owner");
  const houseHolderEmail = ownerInfo?.owner.email;

  if (!houseUrl || !house || !reportType || !reportMessage) {
    return res.status(404).send({
      success: false,
      message: "All fields are required.",
    });
  }
  try {
    const reports = await createReportServices({
      ...req.body,
      otherReportType: undefined,
      house: house,
    });

    const houseInfo = await House.findById(ownerInfo?._id.toString());
    if (houseInfo) {
      houseInfo.totalReports = houseInfo?.totalReports + 1;
      await houseInfo.save();
    }

    res.status(201).send({
      success: true,
      message: "Report Added successfully.",
      data: reports,
    });
    sendReportEmail(houseHolderEmail, houseUrl, reportType, reportMessage);
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err.message,
    });
  }
};

// @routes GET api/v1/report-house/reports-by-house
// @desc Get All the Reports for particular House
// @access Private

const reportsForHouse = async (req, res) => {
  const houseId = req.params.id;
  try {
    const reports = await reportsForHouseService(houseId);
    res.status(201).send({
      success: true,
      message: "Founds Reports by This ID",
      data: reports,
    });
  } catch (error) {
    res.status(404).send({
      success: true,
      message: "server error",
    });
  }
};

// @routes DELETE api/v1/report-house/delete/:id
// @desc Delete Report by ID
// @access Private
const deleteReport = async (req, res) => {
  const reportId = req.params.id;
  const { houseId } = req.query;
  try {
    const report = await deleteReportService(reportId, houseId);
    res.status(201).send({
      success: true,
      message: "Report Deleted Successfully",
      data: report,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { createReport, reportsForHouse, deleteReport };
