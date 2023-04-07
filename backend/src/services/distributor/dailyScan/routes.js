import express from "express";
const router = express.Router();
import { getSites, getCylinders, scanData, getSitesCylinder } from "./controller.js";

export default [

    router.get('/getsites/:id', getSites),
    router.get('/getcylinders/:id', getCylinders),
    router.get('/getsitecylinders/:id', getSitesCylinder),
    router.post('/scanCylinders', scanData),
];
