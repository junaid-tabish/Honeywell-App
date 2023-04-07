import express from "express";
const router = express.Router();
import { siteRules, validationCheck } from "../../../middleware/validation.js";
import {
  updateData,
  addData,
  deleteData,
  getActiveSites,
  findSites,
  getActiveDistributors,
  getContractorsAllocatedToDistributor,
} from "../site/controller.js";
import { checkAdminAuth } from "../../../middleware/authentication.js";

export default [
  router.get("/sites", findSites),
  router.get("/sites/list/:id", getActiveSites),
  router.get("/sites/contractor/:id", getContractorsAllocatedToDistributor),
  router.post("/site", checkAdminAuth, [siteRules, validationCheck, addData]),
  router.delete("/site/:id", checkAdminAuth, deleteData),
  router.put("/site/:id", checkAdminAuth, [
    siteRules,
    validationCheck,
    updateData,
  ]),
];
