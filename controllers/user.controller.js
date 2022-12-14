/* Users Controller */
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const IssuesToken = require("../utils/IssuesJwt");
const {
  findUserByEmailService,
  updateUserProfileService,
  getHouseListByUserIdService,
  findUserByIdService,
  getAuthenticatedUsersService,
} = require("../services/user.services");
const {
  sendVerificationEmail,
  sendVerificationEmailWithResetLink,
  sendEmailForFeatureRequest,
} = require("../utils/sendEmail");
const { default: mongoose } = require("mongoose");
const House = require("../models/house.model");
const Blog = require("../models/blog.model");
const { ReviewsForHouse } = require("../models/review.model");
const {
  uploadProfileImage,
  deleteProfileImage,
  deleteImages,
  uploadImages,
} = require("../utils/Cloudinary");

//@routes POST /api/users
//@desc Register a user
//@access Public

const createUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  //Simple validation
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  // Password Length Validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Password Strength Validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    });
  }

  try {
    //Check for existing user
    const user = await findUserByEmailService(email);
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const newUser = new User({
      name,
      email,
      password,
      role,
      phone: phone ? phone : "",
    });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        await newUser.save();
        res.send({
          success: true,
          message: `${
            role === "user" ? "House Holder " : "Customer "
          } Account created successfully done & send you verification email.`,
        });
      });
    });
    const token = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = token;
    newUser.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await newUser.save();
    // send Verification Email to User
    sendVerificationEmail(email, token);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" + error });
  }
};

// @routes GET /api/v1/users/send-verification-email
// @desc Send Verification Email
// @access Secure
const sendVerificationEmailController = async (req, res) => {
  try {
    const user = await findUserByIdService(req.params.id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: "User not found.",
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // send Verification Email to User
    sendVerificationEmail(user?.email, token);
    res.send({
      success: true,
      message: "send you verification email check inbox plz.",
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Error in Server " + err,
    });
  }
};

// @Routes POST /api/users/verify-email
// @desc Verify Email
// @access Public
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification token is invalid or has expired",
      });
    }
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.sendFile(path.resolve("views/VerifyMailTemp.html"));
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @Routes POST /api/users/login
// @desc Login a user
// @access Public

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //Simple validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  try {
    //Check for existing user
    const user = await findUserByEmailService(email);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    if (user?.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "You are Blocked.Please Contact Admin or email ashikmamdud187@gmail.com",
      });
    }

    //Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    //Create JWT Payload And Issues JWT
    IssuesToken(user, res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @Routes POST /api/users/reset-password
// @desc Reset Password
// @access Public
const resetPassword = async (req, res) => {
  const { resetPasswordEmail: email } = req.body;

  //Simple validation
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  //Check for existing user
  const user = await findUserByEmailService(email);
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "This Email is not registered yet." });

  const token = crypto.randomBytes(20).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  // send Verification Email to User
  sendVerificationEmailWithResetLink(email, token);
  res.status(200).send({
    success: true,
    message:
      "We will sent you email with Password reset Link. Please check your email.",
  });
};

// @routes GET /api/v2/users/verify-reset-password-email
// @desc Reset Password email verify
// @access Private

const verifyResetPasswordMail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification token is invalid or has expired",
      });
    }
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.redirect(`https://houselagbe.vercel.app/new-password/${user?._id}`);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @Routes POST /api/users/change-password
// @desc Change Password
// @access Private
const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  //Simple validation
  if (!email || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  // Password Length Validation
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Password Strength Validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    });
  }

  try {
    //Check for existing user
    const user = await findUserByEmailService(email);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    //Validate password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Old Password is wrong" });

    //Create salt & hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send({ success: true, message: "Password changed successfully done." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @Routes POST /api/users/change-password/new
// @desc Change Password Without Old Password
// @access Private

const changePasswordWithoutOldPassword = async (req, res) => {
  const { id, newPassword } = req.body;

  //Simple validation
  if (!id || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  // Password Length Validation
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Password Strength Validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    });
  }

  try {
    //Check for existing user
    const user = await User.findById(id);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    //Create salt & hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send({ success: true, message: "Password changed successfully done." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @Routes POST /api/users/update-profile
// @desc Update Profile
// @access Private
const updateProfile = async (req, res) => {
  const { email, name, address, phone, avatar, status } = req.body;

  //Simple validation
  if (!email || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  try {
    //Check for existing user
    const user = await findUserByEmailService(email);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    const updatedUser = await updateUserProfileService(user, req.body);
    const { password, ...others } = updatedUser.toObject();
    if (updatedUser) {
      res.send({
        success: true,
        message: "Profile updated successfully done.",
        result: others,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @routes PATCH /api/users/change-profile-picture
// @desc PATCH just change the profile picture
// @access private

const changeProfileImage = async (req, res, next) => {
  const { email } = req.body;

  //Simple validation
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }
  try {
    //Check for existing user
    const user = await findUserByEmailService(email);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    if (user?.profileImage) {
      await deleteImages(user?.cloudinaryId, email, "profiles");
    }

    const profileImage = await uploadImages(req.file.path, email, "profiles");
    user.profileImage = profileImage?.secure_url;
    user.cloudinaryId = profileImage?.public_id;
    await user.save();
    if (profileImage) {
      res.send({
        success: true,
        message: "Profile picture updated successfully done.",
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// @Routes GET /api/users/house-list
// @desc Get House List
// @access Private
const getHouseByUserId = async (req, res) => {
  try {
    const houseList = await getHouseListByUserIdService(req.user.id);
    if (houseList) {
      res.send({ success: true, message: "House List", result: houseList });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @routes GET /api/users
// @desc Get all users
// @access Private
const getUsers = async (req, res) => {
  const { role, page, limit } = req.query;

  let filter = {};
  const skip = (page - 1) * parseInt(limit);
  if (role) {
    if (role === "All") {
      filter = {};
    } else {
      filter.role = role;
    }
  }
  if (page || limit) {
    filter.skip = skip;
    filter.limit = Number(limit);
  }

  try {
    const users = await getAuthenticatedUsersService(filter);
    const count = await User.countDocuments();

    if (users.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Get Users",
        data: users,
        count: count,
      });
    }

    res.status(404).json({ success: false, message: "No Users Found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @routes GET /api/users/:id
// @desc Get user by id
// @access Private
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserByIdService(id);
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server Error" });
  }
};

/* Send Feature Request */

const sendFeatureRequest = async (req, res) => {
  const { subject, requestText, author } = req.body;

  if (!subject || !requestText) {
    return res.status(400).send({
      success: false,
      message: "All fields is required.",
    });
  }

  await sendEmailForFeatureRequest(subject, requestText, author);
  res.status(200).send({
    success: true,
    message: `Your message has been sent to the App Admin. Wait to Admin response.`,
  });
};

/* Change Admin Role By Admin */

const changeAdminRole = async (req, res) => {
  const { query, id } = req.body;
  const user = await findUserByIdService(id);
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: `User doesn't exist` });
  if (user.role === query)
    return res.status(403).send({
      success: false,
      message: `This user already ${query === "user" ? "House Holder" : query}`,
    });

  if (query === "admin" || query === "manager") {
    user.blogAllowed = true;
  } else {
    user.blogAllowed = false;
  }
  user.role = query;
  user.save();
  res.status(200).send({
    success: true,
    message: `Congratulation! Now your ${
      query === "user" ? "House Holder" : query
    }`,
  });
};

/* Change Admin Status By Admin */

const changeAdminStatus = async (req, res) => {
  const { query, id } = req.body;
  const user = await findUserByIdService(id);
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: `User doesn't exist` });
  if (user.status === query)
    return res
      .status(403)
      .send({ success: false, message: `This user already ${query}` });

  user.status = query;
  user.save();
  res.status(200).send({
    success: true,
    message: `Congratulation! Now your ${query}`,
  });
};

/* Delete User By Admin */
const deleteAdminUser = async (req, res) => {
  const { id } = req.params;
  const user = await findUserByIdService(id);
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: `User doesn't exist` });
  await user.remove();
  res.status(200).send({
    success: true,
    message: `Congratulation! Now your user has been deleted`,
  });
};

/* Delete Account by own account holder */
const deleteAccountByUser = async (req, res) => {
  const id = req.user.id;
  const user = await findUserByIdService(id);
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: `User doesn't exist` });

  /* Remove House For if they house holder */
  if (user.role === "user") {
    const houses = await House.find({ owner: user._id });
    houses.forEach(async (house) => {
      await house.remove();
      /* Remove houses image on cloudinary */
      await deleteImages(house?.image?.public_id, user.email, "previewImages");

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
  res.status(200).send({
    success: true,
    message: `User has been deleted`,
  });
};

module.exports = {
  getUsers,
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  changePassword,
  updateProfile,
  getHouseByUserId,
  getUserById,
  changeProfileImage,
  verifyResetPasswordMail,
  changePasswordWithoutOldPassword,
  sendFeatureRequest,
  changeAdminRole,
  changeAdminStatus,
  deleteAdminUser,
  deleteAccountByUser,
  sendVerificationEmailController,
};
