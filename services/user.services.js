const User = require("../models/user.model")

/* Create user service */
const createUserService = async() =>{
    return await User.create()
}