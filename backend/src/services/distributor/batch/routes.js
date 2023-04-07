import express from "express";
const router = express.Router();
import {getDistributorBatches } from "./controller.js";

export default [
 
  router.get('/allotedbatches/:id', getDistributorBatches), // get list of allocated batches to distributor

];
