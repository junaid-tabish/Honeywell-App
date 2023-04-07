import express from "express";
const router = express.Router();
import { getCylindersOfContractor, getSitesOfContractor } from "./controller.js";

export default [

    router.get('/getsites/:id', getSitesOfContractor),
    router.get('/getcylinders/:id', getCylindersOfContractor),
];
