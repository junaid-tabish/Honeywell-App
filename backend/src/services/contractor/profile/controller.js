import UserModel from "../../../models/user.js";
import { CylinderModel } from "../../../models/cylinder.js";
import { APIResponse } from "../../../utils/common.js";
import {USER_CONTRACTOR } from "../../../utils/constant.js";
import jwt from 'jsonwebtoken';

export const getProfile = async (req, res) => {
  const id = req.params.id;
  const data = await UserModel.findById(id);
  let response = new APIResponse(0, "Data is not defined")   
  if (data && data.role==USER_CONTRACTOR) {
    response = new APIResponse(1, "Data found", data)
  }
  res.send(response);
}

export const counter = async (req,res) => {
  const { authorization } = req.headers
        const token = authorization.split(' ')[1];
        const decoded = jwt.decode(token).userID;
  const batchCount= await UserModel.findOne({_id:decoded});
   const count = {
      siteCount:batchCount.assignedSites.length,
      batchCount:batchCount.assignedBatches.length,
  }
  const response = new APIResponse(1,"got counts",count)
  res.send(response)
}


export const inventoryCounter = async (req,res) => {
  const cylinderCount = await CylinderModel.estimatedDocumentCount();
  const filledCylinderCount = await  CylinderModel.countDocuments({filledStatus : 1});
  const emptyCylinderCount= await CylinderModel.countDocuments({filledStatus : 0});
  // const counterfitRiskCylinderCount= await BatchModel.estimatedDocumentCount();
  const replacementRequestCount= await CylinderModel.countDocuments({replacementRequest: 1});
  const count = {
      cylinderCount,
      filledCylinderCount,
      emptyCylinderCount,
      replacementRequestCount,
  }

  const response = new APIResponse(1,"got counts",count)
  res.send(response)
}

