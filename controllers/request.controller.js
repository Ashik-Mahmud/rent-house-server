const BlogRequest = require("../models/request.model");
const User = require("../models/user.model");
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
      !user.twitterLink ||
      !user.instagramLink ||
      !user.profileImage
    ) {
      return res
        .status(422)
        .json({
          message:
            "Some Profile information is not added, Please first fillup all the missing information to send a request.",
        });
    }

    const blog_request = await sendRequestService(req);
    user.isBlogRequestSent = true;
    await user.save();
    return res
      .status(201)
      .send({
        success: true,
        message: "Sent your request to the admin",
        req: blog_request,
      });
  } catch (err) {
    return res
      .status(403)
      .send({
        success: false,
        message: `Something went. Please try again ${err}`,
      });
  }
};

/* Get All Blog Request Users */
const getAllRequestsUsers = async (req, res) => {
  const { page, limit, role } = req.query;
 console.log(page, limit, role);
 
  try {
    const filter = {
        filter: {reqFor: role}
    };
    console.log(filter.filter);

    if (page || limit) {
      const skip = (page - 1) * Number(limit);
      filter.skip = Number(skip);
      filter.limit = Number(limit);
    }
    console.log(filter);
    
    const blogRequest = await getAllRequestService(filter);
    const count = await BlogRequest.count(filter.filter);
    if (!blogRequest) {
      return res.status(400).json({ message: "Blog Request not Found" });
    }
    return res
      .status(200)
      .send({
        success: true,
        message: "Get All Request",
        req: blogRequest,
        count,
      });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `Something went. Please try again` });
  }
};

/* Controller for Confirm Request for blog  */
const approveBlogRequest = async (req, res) => {
  try {
    const user = await User.findById(req.query.authorId);
    const blog = await BlogRequest.findById(req.params.id);
    console.log("req id", blog._id);
    console.log("user id", user._id);
    if (blog.status === "approved") {
      return res.status(401).json({ message: "Request Already Approved" });
    }
    blog.status = "approved";
    user.blogAllowed = true;
    user.isBlogRequestSent = undefined;
    await blog.save();
    await user.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Your request has been approve by the Admin",
      });
  } catch (err) {
    return res
      .status(403)
      .send({
        success: false,
        message: `Something went. Please try again ${err}`,
      });
  }
};

/* Deny User Request */
const rejectBlogRequest = async (req, res) => {
  try {
    const user = await User.findById(req.query.authorId);
    const blog = await BlogRequest.findById(req.params.id);
    if (!blog) {
      return res.status(401).json({ message: "blog request not found." });
    }
    user.blogAllowed = false;
    user.isBlogRequestSent = undefined;
    await blog.remove();
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Your request has been removed" });
  } catch (error) {
    return res
      .status(403)
      .send({
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
      return res
        .status(400)
        .json({
          success: false,
          message: "You Already Send a Request Before!",
        });
    }
    if (
        !user.phone ||
        !user.address ||
        !user.facebookLink ||
        !user.twitterLink ||
        !user.instagramLink ||
        !user.profileImage
      ) {
        return res
          .status(422)
          .json({
            message:
              "Some Profile information is not added, Please first fillup all the missing information to send a request.",
          });
      }

    user.isHouseHolderReqSent = true;
    await user.save();
    const house_request = await sendRequestService(req);
    return res
      .status(201)
      .send({
        success: true,
        message: "Sent your request to the admin",
        req: house_request,
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        success: false,
        message: `Something went. Please try again ${error.message}`,
      });
  }
};

module.exports = {
  createBlogRequest,
  getAllRequestsUsers,
  approveBlogRequest,
  rejectBlogRequest,
  createHouseHolderRequest,
};
