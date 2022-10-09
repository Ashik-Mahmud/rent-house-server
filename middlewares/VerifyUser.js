const VerifyUser = async(req, res, next) => {
    if(req.user.role !== "user"){
        return res.status(401).json({
            success: false,
            message:  "Not authorized"
        })
    }
    next();
}

module.exports = VerifyUser;