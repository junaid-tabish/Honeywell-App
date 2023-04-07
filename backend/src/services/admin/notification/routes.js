import express from "express";
const router = express.Router();
import { getNotificationsList, markNotifications } from "./controller.js";


export default [
    router.get('/notifications', getNotificationsList),
    router.get('/mark/notifications', markNotifications)
]