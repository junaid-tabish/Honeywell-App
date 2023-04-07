import express from "express";
const router = express.Router();
import { addBatch, updateBatch, deleteBatch, findBatches, getActiveBatches, viewBatchId } from "./controller.js";
import { batchRules, validationCheck } from "../../../middleware/validation.js";
import { checkAdminAuth } from "../../../middleware/authentication.js";

export default [
  router.get("/batches", findBatches), // search || sort || filter || pagination
  router.post("/batch", checkAdminAuth, [batchRules, validationCheck, addBatch]), //add batch
  router.put("/batch/:id", checkAdminAuth, [batchRules, validationCheck, updateBatch]), //update batch
  router.delete("/batch/:id", checkAdminAuth, deleteBatch), // delete batch
  router.get("/batches/list", getActiveBatches), //get all active batches
  router.get("/batch/:id", viewBatchId),
];
