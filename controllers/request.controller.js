const Report = require("../models/reportHouse.model");
const BlogRequest = require("../models/request.model");
const Question = require("../models/question.model");
const House = require("../models/house.model");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const { ReviewsForHouse } = require("../models/review.model");
const {
  getAllRequestService,
  sendRequestService,
} = require("../services/request.services");

/* Create Blog Request */
const createBlogRequest = async (req, res) => {
  try {
    const user = await User.findById(req.body.author.id);
    if (user.isBlogRequestSent) {
      return res
        .status(400)
        .json({ message: "You Already Send a Request Before!" });
    }

    if (
      !user.phone ||
      !user.address ||
      !user.facebookLink ||
      !user.profileImage
    ) {
      return res.status(422).json({
        message:
          "Some Profile information is not added, Please first fillup all the missing information to send a request.",
      });
    }

    const blog_request = await sendRequestService(req);
    user.isBlogRequestSent = true;
    await user.save();
    return res.status(201).send({
      success: true,
      message: "Sent your request to the admin",
      req: blog_request,
    });
  } catch (err) {
    return res.status(403).send({
      success: false,
      message: `Something went. Please try again ${err}`,
    });
  }
};

/* Get All Blog Request Users */
const getAllRequestsUsers = async (req, res) => {
  const { page, limit, role, q } = req.query;
  try {
    const filter = {
      filter: { reqFor: role },
    };

    if (page || limit) {
      const skip = (page - 1) * Number(limit);
      filter.skip = Number(skip);
      filter.limit = Number(limit);
    }

    if (q) {
      filter.filter.$text = {
        $search: q,
      };
    }

    const blogRequest = await getAllRequestService(filter);
    const count = await BlogRequest.countDocuments(filter.filter);
    const unapprovedCount = await BlogRequest.countDocuments({
      status: "pending",
    });
    if (!blogRequest) {
      return res.status(400).json({ message: "Blog Request not Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Get All Request",
      req: blogRequest,
      count,
      unapprovedCount,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `Something went. Please try again` });
  }
};

/* Controller for Confirm Request for blog  */
const approveRequest = async (req, res) => {
  const { role } = req.query;

  try {
    const user = await User.findById(req.query.authorId);
    const blog = await BlogRequest.findById(req.params.id);

    console.log("user id", user._id);
    if (blog.status === "approved") {
      return res.status(401).json({ message: "Request Already Approved" });
    }
    blog.status = "approved";
    if (role === "blog") {
      user.blogAllowed = true;
      user.isBlogRequestSent = undefined;
    } else {
      user.isHouseHolderReqSent = undefined;
      user.role = "user";
    }
    await blog.save();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Your request has been approve by the Admin",
    });
  } catch (err) {
    return res.status(403).send({
      success: false,
      message: `Something went. Please try again ${err}`,
    });
  }
};

/* Deny User Request */
const rejectBlogRequest = async (req, res) => {
  const { role } = req.query;
  try {
    const user = await User.findById(req.query.authorId);
    const blog = await BlogRequest.findById(req.params.id);
    if (!blog) {
      return res.status(401).json({ message: "blog request not found." });
    }
    if (role === "blog") {
      user.isBlogRequestSent = undefined;
      user.blogAllowed = false;
    } else {
      user.isHouseHolderReqSent = undefined;
      user.role = "customer";
    }
    await blog.remove();
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Your request has been removed" });
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: `Something went. Please try again ${error}`,
    });
  }
};

/**
 *
 * House Request Controller
 * All about House Request
 *
 *  */

const createHouseHolderRequest = async (req, res) => {
  try {
    const user = await User.findById(req?.body?.author?.id);
    if (user.isHouseHolderReqSent) {
      return res.status(400).json({
        success: false,
        message: "You Already Send a Request Before!",
      });
    }
    if (
      !user.phone ||
      !user.address ||
      !user.facebookLink ||
      !user.profileImage
    ) {
      return res.status(422).json({
        message:
          "Some Profile information is not added, Please first fillup all the missing information to send a request.",
      });
    }

    user.isHouseHolderReqSent = true;
    await user.save();
    const house_request = await sendRequestService(req);
    return res.status(201).send({
      success: true,
      message: "Sent your request to the admin",
      req: house_request,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Something went. Please try again ${error.message}`,
    });
  }
};

/* Get All the Notifications */
const getAllNotifications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId)
    return res.status(404).send({
      success: false,
      message: "Bad request",
    });

  const reports = await Report.find({ houseHolder: userId }).sort("-createdAt");
  const houses = await House.find({ owner: userId });
  const questions = await Question.find({
    house: houses[0]?._id,
    accepted: false,
  }).sort("-createdAt");
  const reviews = await ReviewsForHouse.find({
    house: houses[0]?._id,
    isAccepted: false,
  }).sort("-createdAt");

  res.status(202).send({
    success: true,
    message: "Get All the Notification.",
    data: {
      reports,
      questions,
      reviews,
    },
  });
};

/* Get All House Request Users */
const getAllReportsForHomepage = async (req, res) => {
  try {
   
    const customers = await User.countDocuments({ role: "customer" });
    const totalHouses = await House.countDocuments({status: "approved"});
    const totalBlogs = await Blog.countDocuments({status: "active"});
    return res.status(200).send({
      success: true,
      message: "Get All Request",
      data: {customers, totalHouses, totalBlogs},
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Something went. Please try again ${error.message}`,
    });
  }
};
module.exports = {
  createBlogRequest,
  getAllRequestsUsers,
  approveRequest,
  rejectBlogRequest,
  createHouseHolderRequest,
  getAllNotifications,
  getAllReportsForHomepage,
};
