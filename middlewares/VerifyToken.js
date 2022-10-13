const jwt = require("jsonwebtoken")
const VerifyToken = async(req, res, next) =>{
    const token = req.header("Authorization")?.split(" ")[1];      
        
    if(!token) return res.status(401).send({success: false, message: "Access Denied"});    

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified.user;
        next();
    } catch (error) {
        res.status(400).send({success: false, message: "Invalid Token", error});
    }
};

module.exports = VerifyToken;