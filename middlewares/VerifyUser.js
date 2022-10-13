const User = require("../models/user.model");

const VerifyUser = async(req, res, next) => {
    const user = await User.findById(req.user.id)
    if(user.role !== "user"){
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }
    next()
}

module.exports = VerifyUser;