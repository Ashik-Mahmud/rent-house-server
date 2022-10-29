// @routes /api/v1/admin/accept
// @desc Accept house

const AppOption = require("../models/app.model");
const Blog = require("../models/blog.model");
const House = require("../models/house.model");
const { ReviewsForHouse } = require("../models/review.model");
const User = require("../models/user.model");
const {
  getAllUsersService,
  findByIdUserService,
  getActiveUsersService,
  findHousesBySlugService,
} = require("../services/admin.services");
const { findByIdHouseService } = require("../services/house.services");
const { deleteImages } = require("../utils/Cloudinary");
const {
  sendBulkEmailForAllUsers,
  sendEmailWithRejectNotes,
  sendApprovedSuccessMail,
  sendEmailForDeleteHouseByAdmin,
} = require("../utils/sendEmail");

// @access Private
const acceptHouse = async (req, res) => {
  try {
    const house = await findByIdHouseService(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    if (house.status !== "pending" && house.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "House already accepted",
      });
    }

    house.status = "approved";
    await house.save();
    res.status(200).json({
      success: true,
      message: "House accepted successfully",
    });
    sendApprovedSuccessMail({
      email: house.owner.email,
      name: house.owner.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/admin/reject
// @desc Reject house
// @access Private
const rejectHouse = async (req, res) => {
  const { notes } = req.body;
  try {
    const house = await findByIdHouseService(req.params.id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    const author = {
      name: house?.owner?.name,
      email: house?.owner?.email,
    };
    if (house.status !== "pending" && house.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "House already rejected",
      });
    }
    house.status = "rejected";
    await house.save();
    res.status(200).json({
      success: true,
      message: "House rejected successfully",
    });
    sendEmailWithRejectNotes(notes, author);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* Delete House by ID for Admin or Super Admin */
const deleteHouseByAdmin = async (req, res) => {
  try {
    const house = await findByIdHouseService(req.params.id);
    if (!house)
      return res.status(404).send({
        success: false,
        message: `No house found.`,
      });
    await house.remove();
    res.status(202).send({
      success: false,
      message: `House deleted successfully done.`,
    });
    sendEmailForDeleteHouseByAdmin({
      email: house.owner.email,
      name: house.owner.name,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: `Server Error ${err}`,
    });
  }
};

// @routes /api/v1/admin/users
// @desc Get all users
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService({
      status: "active",
      isVerified: true,
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes /api/v1/admin/action-user/:id
// @desc Action user
// @access Private
const actionUser = async (req, res) => {
  try {
    const user = await findByIdUserService(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Can not action admin",
      });
    }
    if (user.status === "active") {
      user.status = "inactive";
    } else {
      user.status = "active";
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Action user successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes /api/v1/admin/delete-user/:id
// @desc Delete user
// @access Private
const deleteUser = async (req, res) => {
  try {
    const user = await findByIdUserService(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Can not delete admin",
      });
    }

    /* Remove House For if they house holder */
    if (user.role === "user") {
      const houses = await House.find({ owner: user._id });
      houses.forEach(async (house) => {
        await house.remove();
        /* Remove houses image on cloudinary */
        await deleteImages(
          house?.image?.public_id,
          user.email,
          "previewImages"
        );

        /* Remove houses gallery images on cloudinary */
        house?.gallery?.forEach(async (image) => {
          await deleteImages(image?.public_id, user.email, "galleryImages");
        });
      });
    }

    /* Remove Articles for particular Users */
    const articles = await Blog.find({ author: user._id });
    if (articles) {
      articles.forEach(async (article) => {
        await article.remove();
      });
    }

    /* Remove Reviews for this users */
    const reviews = await ReviewsForHouse.find({ "author.userId": user._id });
    if (reviews) {
      reviews.forEach(async (review) => {
        await review.remove();
      });
    }
    /* Remove Profile Image for this User */
    if (user.profileImage) {
      await deleteImages(user?.cloudinaryId, user.email, "profiles");
    }

    await user.remove();
    res.status(200).json({
      success: true,
      message: "Delete user successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes /api/v1/admin/send-email-to-users
// @desc Send email to users
// @access Private
const sendEmailToUsers = async (req, res) => {
  try {
    const { role } = req.user;
    const { userEmails, subject, content } = req.body;
    if (!subject || !content || !userEmails) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    await sendBulkEmailForAllUsers(userEmails, subject, content, role);
    res.status(200).json({
      success: true,
      message: "Send emails successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error.message,
    });
  }
};

// @routes PATCH api/admin/make-admin/:id
// @desc Make general Users as admin
// @access private

const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await findByIdUserService(userId);
    if (user.role === "user" && user.status === "active") {
      user.role = "admin";
    } else {
      user.role = "user";
    }
    await user.save();
    res.status(201).send({
      success: true,
      message: "User successfully created as Admin",
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err.message,
    });
  }
};

/* Controller for change app name */
const changeAppName = async (req, res) => {
  const { name } = req.body;

  try {
    const app = await AppOption.findByIdAndUpdate(
      "635d69071a4fcf8e1c6833fe",
      req.body
    );
    if (!app) {
      return res.status(404).send({
        success: false,
        message: "App not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "App name changed successfully",
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err.message,
    });
  }
};

/* Public controller */
const getAppOptions = async (req, res) => {
  try {
    const app = await AppOption.findById("635d69071a4fcf8e1c6833fe");
    res.status(200).send({
      success: true,
      app,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err.message,
    });
  }
};

/* Get Houses By Slug */

const getHouseByQuery = async (req, res) => {
  const { slug } = req.params;
  const { limit, page, filter } = req.query;

  try {
    let fields = {};
    if (page || limit) {
      const skip = (Number(page) - 1) * Number(limit);
      fields.limit = Number(limit);
      fields.skip = skip;
    }
    if (slug) {
      fields.slug = slug;
    }
    if (filter) {
      fields.sortBy = filter;
    }
    const houses = await findHousesBySlugService(fields);
    if (!houses) {
      return res.status(404).send({
        success: false,
        message: "House not found",
      });
    }
    res.status(200).send({
      success: true,
      data: houses,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err.message,
    });
  }
};

// @routes GET /api/v1/houses/get-houses-count
// @desc   Get houses count
// @access Public
const getHouseCountForAdmin = async (req, res) => {
  try {
    const approved = await House.countDocuments({ status: "approved" });
    const rejected = await House.countDocuments({ status: "rejected" });
    const unapproved = await House.countDocuments({ status: "pending" });
    const blogs = await Blog.countDocuments({ status: "active" });
    const users = await User.countDocuments({ status: "active" });

    res.status(200).json({
      success: true,
      message: "Houses count",
      rejected,
      approved,
      unapproved,
      blogs,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};

module.exports = {
  acceptHouse,
  rejectHouse,
  getAllUsers,
  actionUser,
  deleteUser,
  sendEmailToUsers,
  makeAdmin,
  changeAppName,
  getAppOptions,
  getHouseByQuery,
  deleteHouseByAdmin,
  getHouseCountForAdmin,
};
