const User = require("../models/user.model")

/* Create user service */
exports.findUserByEmailService = async(email) => {
    try {
        const user = await User.findOne({email});
        return user;
    } catch (error) {
       console.log(error.message);
       
    }
}
