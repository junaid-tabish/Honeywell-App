import express from "express";
const router = express.Router();
import { getActiveContractors, getActiveCylinders, getActiveSites, getActiveDistributors, getCylinders } from "./controller.js";

export default [
  router.get("/asset-Track-Distributors", getActiveDistributors),
  router.get("/asset-Track-Contractors/:id", getActiveContractors),
  router.get("/asset-Track-Sites/:id", getActiveSites),
  router.get("/asset-Track-Cylinders", getActiveCylinders),
  router.get("/searchCylinder", getCylinders),
]