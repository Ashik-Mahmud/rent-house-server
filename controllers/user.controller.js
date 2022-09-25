/* Users Controller */
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const IssuesToken = require("../utils/IssuesJwt");
const { findUserByEmailService, updateUserProfileService } = require("../services/user.services");

//@routes POST /api/users
//@desc Register a user
//@access Public

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  //Simple validation
  if (!name || !email || !password) {
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
    const newUser = new User({ name, email, password });
    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        await newUser.save();
        res.send({ success: true, message: "User created successfully done." });
      });
    });
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
  const { email, password } = req.body;
  //Simple validation
  if (!email || !password) {
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
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        user.password = hash;
        await user.save();
        res.send({
          success: true,
          message: "Password reset successfully done.",
        });
      });
    });
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
       if(updatedUser){
        res.send({ success: true, message: "Profile updated successfully done." , result: updatedUser});
       }
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



// @routes GET /api/users
// @desc Get all users
// @access Private
const getUsers = async (req, res) => {
  try {
    res.status(200).send({ success: true, message: "Get Users" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  resetPassword,
  changePassword,
  updateProfile
};
