const User = require("../models/user.model");

/* Get All the Users From Admin Page */
exports.getAllUsersService = async (queries) => {
    try {
        const users = await User.find(queries).skip(queries.skip).limit(queries.limit);
        /* Get Total Numbers of Users */
        const totalUsers = await User.countDocuments();
        return { totalUsers, users};
    } catch (error) {
        console.log(error.message);
    }
}


/* Find Single user By ID */
exports.findByIdUserService = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.log(error.message);
    }
}