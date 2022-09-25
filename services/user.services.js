const House = require("../models/house.model");
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


/* Update Profile Service */
exports.updateUserProfileService = async(user, body) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id: user._id},
            body,
            {new: true}
        );
        return updatedUser;
    } catch (error) {
        console.log(error.message);
    }
}


/* Get Houses List by User ID */
exports.getHouseListByUserIdService = async(userId) => {
    try {
        const houseList = await House.find({owner: userId});
        return houseList;
    } catch (error) {
        console.log(error.message);
    }
}