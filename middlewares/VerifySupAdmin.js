const User = require('../models/user.model' )
const VerifySupAdmin = async(req, res, next) => {
    const user = await User.findById(req.user.id)
    if(user.role !== "admin"){
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }
    next();
};

module.exports = VerifySupAdmin;