/* Users Controller */
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const IssuesToken = require("../utils/IssuesJwt");

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
    const user = await User.findOne({ email });
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
        //Create JWT Payload And Issues JWT
        IssuesToken(newUser, res);
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
    const user = await User.findOne({ email });
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

module.exports = { getUsers, createUser, loginUser };
