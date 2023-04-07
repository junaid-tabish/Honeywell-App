import { APIResponse } from "../../../utils/common.js";
import NotificationModel from '../../../models/notification.js'
import {UNREAD } from "../../../utils/constant.js";
import { USER_ADMIN } from "../../../utils/constant.js";
import UserModel from "../../../models/user.js";
import jwt from 'jsonwebtoken'


//notifications of admin
export const  getNotificationsList = async(req, res) => {
    try {
        let current_day_minu_one = new Date(Date.now() - 24*60*60*1000);
        const d = await NotificationModel.deleteMany( { createdAt : {$lt : current_day_minu_one } })
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const id = jwt.decode(token).userID;
        const data = await UserModel.findOne({ _id: id });
        if(data.role === USER_ADMIN){
            const notifications = await NotificationModel.find({role: USER_ADMIN}).sort({createdAt: -1})
            const unread = await NotificationModel.countDocuments({role:USER_ADMIN, status: UNREAD})
            let response = new APIResponse(0, "Details not found");
            const responseData = {data: notifications, unreadCount: unread}
            if (notifications) {
                response = new APIResponse(1, "Details found", responseData);
            }
            res.send(response);
        }else{
            let current_day_minu_one = new Date(Date.now() - 24*60*60*1000);
            const d = await NotificationModel.deleteMany( { createdAt : {$lt : current_day_minu_one } })
            const notifications = await NotificationModel.find({userId: id}).sort({createdAt: -1})
            const unread = await NotificationModel.countDocuments({userId: id, status: UNREAD})
            let response = new APIResponse(0, "Details not found");
            const responseData = {data: notifications, unreadCount: unread}
            if (notifications) {
                response = new APIResponse(1, "Details found", responseData);
            }
            res.send(response);
        }
        
    } catch (error) {
        console.log(error)
        const response = new APIResponse(0, "Exception Occurs:", { error: error.message });
        res.send(response);
    }
}

//make notifications as mark for admin
export const markNotifications = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const id = jwt.decode(token).userID;
        const data = await UserModel.findOne({ _id: id });
        if(data.role === USER_ADMIN){
            await NotificationModel.updateMany({role: USER_ADMIN},{status: 0})
            const response = new APIResponse(1, "success");
            res.send(response);
        }else{
            await NotificationModel.updateMany({userId: id},{status: 0})
            const response = new APIResponse(1, "success");
            res.send(response);
        }
        
    } catch (error) {
        console.log(error)
        const response = new APIResponse(0, "failure");
        res.send(response);
    }
}