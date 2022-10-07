/* Users Controller */
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path")
const IssuesToken = require("../utils/IssuesJwt");
const { findUserByEmailService, updateUserProfileService, getHouseListByUserIdService, findUserByIdService } = require("../services/user.services");
const { sendVerificationEmail } = require("../utils/sendEmail");

//@routes POST /api/users
//@desc Register a user
//@access Public

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
   console.log(name, email ,password);
   
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
        res.send({ success: true, message: "User created successfully done & send you verification email." });
      });
    });
    const token = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = token;
    newUser.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await newUser.save();
    // send Verification Email to User
    sendVerificationEmail(email, token);


  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
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
        
        res.sendFile(path.resolve('views/VerifyMailTemp.html'));
        
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
        const {password, ...others}  = updatedUser.toObject();
       if(updatedUser){
        res.send({ success: true, message: "Profile updated successfully done." , result: others});
       }
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// @routes PATCH /api/users/change-profile-picture
// @desc PATCH just change the profile picture
// @access private

const changeProfileImage = async (req, res, next) =>{
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

        user.profileImage = req.file.filename;
        await user.save();
        res.send({ success: true, message: "Profile picture updated successfully done." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


    


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
  try {
    res.status(200).send({ success: true, message: "Get Users" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server Error" });
  }
};


// @routes GET /api/users/:id
// @desc Get user by id
// @access Private
const getUserById = async (req, res) => {
    try {
        const user = await findUserByIdService(req.params.id);
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: "Server Error" });
    }
};


module.exports = {
  getUsers,
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  changePassword,
  updateProfile,
  getHouseByUserId, getUserById, changeProfileImage
};
