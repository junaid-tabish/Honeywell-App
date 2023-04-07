import mongoose from "mongoose";
import { UNREAD } from "../utils/constant.js";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    role:{
        require: false,
        type: String,
        trim: true
    },
    userId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: Number,
        enum: [0, 1], // 0 for read
        default: UNREAD    // 1 for unread
    }
}, { timestamps: true })

const NotificationModel = mongoose.model("notification", notificationSchema)

export default NotificationModel;