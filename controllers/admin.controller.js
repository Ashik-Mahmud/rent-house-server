
// @routes /api/v1/admin/accept
// @desc Accept house

const { getAllUsersService, findByIdUserService, getActiveUsersService } = require("../services/admin.services");
const { findByIdHouseService } = require("../services/house.services");
const { sendBulkEmailForAllUsers } = require("../utils/sendEmail");

// @access Private
const acceptHouse = async (req, res) => {
    
    try {
        const house = await findByIdHouseService(req.params.id);
                
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        if(house.status !== "pending" && house.status !== "rejected"){
            return res.status(400).json({
                success: false,
                message: "House already accepted"
            })
        }

        house.status = "approved";
        await house.save();
        res.status(200).json({
            success: true,
            message: "House accepted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// @routes /api/v1/admin/reject
// @desc Reject house
// @access Private
const rejectHouse = async (req, res) => {
    try {
        const house = await findByIdHouseService(req.params.id);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        if(house.status !== "pending" && house.status !== "approved"){
            return res.status(400).json({
                success: false,
                message: "House already rejected"
            })
        }

        house.status = "rejected";
        await house.save();
        res.status(200).json({
            success: true,
            message: "House rejected successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

// @routes /api/v1/admin/users
// @desc Get all users
// @access Private
const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService({});
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// @routes /api/v1/admin/action-user/:id
// @desc Action user
// @access Private
const actionUser = async (req, res) => {
    try {
        const user = await findByIdUserService(req.params.id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if(user.role === "admin"){
            return res.status(400).json({
                success: false,
                message: "Can not action admin"
            })
        }
        if(user.status === "active"){
            user.status = "inactive";
        }else{
            user.status = "active";
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "Action user successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// @routes /api/v1/admin/delete-user/:id
// @desc Delete user
// @access Private
const deleteUser = async (req, res) => {
    try {
        const user = await findByIdUserService(req.params.id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"

            })
        }
        if(user.role === "admin"){
            return res.status(400).json({
                success: false,
                message: "Can not delete admin"
            })
        }
        await user.remove();
        res.status(200).json({
            success: true,
            message: "Delete user successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// @routes /api/v1/admin/send-email-to-users
// @desc Send email to users
// @access Private
const sendEmailToUsers = async (req, res) => {
    try {
        const {isAllUsers=true, subject, content } = req.body;
        if(!subject || !content){
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            })
        }
        let emails = "";
        if(isAllUsers){
         const users = await getActiveUsersService();
         emails = users.map(user => user.email).join(",");
        }else{
            emails = req.body.emails;
        }   
        await sendBulkEmailForAllUsers(emails, subject, content);
        res.status(200).json({
            success: true,
            message: "Send emails successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"+ error.message
        })
    }
}



// @routes PATCH api/admin/make-admin/:id
// @desc Make general Users as admin
// @access private

const makeAdmin = async(req, res) =>{
    const userId = req.params.id;
    try{
        const user = await findByIdUserService(userId);
        if(user.role === 'user' && user.status === 'active'){
            user.role = 'admin'
        }else{
            user.role = 'user'
        }
        await user.save();
        res.status(201).send({
            success: true,
            message: "User successfully created as Admin"
        })
        
    }catch(err){
        res.status(404).send({
            success: false,
            message: "Server Error"+ err.message
        })
    }
}



module.exports = { acceptHouse, rejectHouse, getAllUsers, actionUser, deleteUser, sendEmailToUsers, makeAdmin };