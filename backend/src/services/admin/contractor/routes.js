import express from "express";
const router = express.Router();
import { userRules, validationCheck } from "../../../middleware/validation.js";
import {
  addContractor,
  updateContractor,
  getContractorById,
  deleteContractor,
  findContractor,
  getActiveContractors,
  getContractorSites,
  getSitesOfContractor,
  deleteAllotedSite,
  getDistributorOfContractor,
  assignCylinder,
  updateContractorSites,
  cylindersOfBatch,
  detailsOfBatch,
} from "./controller.js";
// import { getCylinders } from '../Asset tracking/controller.js';
import { checkAdminAuth } from "../../../middleware/authentication.js";

export default [
  router.get("/contractors", checkAdminAuth, findContractor), //search || sort || filter || pagination
  router.post("/contractor", addContractor), //add contractor
  router.get("/contractor/:id", checkAdminAuth, getContractorById), //get data by Id
  router.put("/contractor/:id", checkAdminAuth, [userRules, validationCheck, updateContractor]), //update data
  router.delete("/contractor/:id", checkAdminAuth, deleteContractor), // delete data
  router.get("/contractors/list", getActiveContractors), // get acitive contractors
  router.get("/contractor/sites/:id", getContractorSites),//sites can be alloted to contractor
  router.get("/contractor/allotedsites/:id", getSitesOfContractor),//get sites alloted to contrator(c)
  router.put("/contractor/allotedsites/:id",checkAdminAuth, deleteAllotedSite),
  router.put("/contractor/updatesites/:id",checkAdminAuth, updateContractorSites),
  router.get("/contractor/assigncylinder/:id",getDistributorOfContractor),//get distributor details of selected contractor
  router.put("/contractor/assigncylinder/:id", checkAdminAuth, assignCylinder),//assign cylinder to contractor
  router.get("/contractor/assigncylinder-cylinders/:id",cylindersOfBatch),//get details of cylinder in a batch
  router.get("/contractor/assigncylinder-batches/:id",detailsOfBatch),//details batches assigned to distributor

];
