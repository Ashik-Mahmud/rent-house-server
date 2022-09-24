const VerifyToken = async(req, res, next) =>{
    const token = req.header("Authorization");
    if(!token) return res.status(401).send({success: false, message: "Access Denied"});
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({success: false, message: "Invalid Token"});
    }
};

module.exports = VerifyToken;