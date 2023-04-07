import UserModel from "../../../models/user.js"
import { APIResponse } from "../../../utils/common.js";
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../utils/constant.js";
import SiteModel from "../../../models/site.js";
import BatchModel from "../../../models/batch.js";
import {CylinderModel} from "../../../models/cylinder.js";


export const getProfile = async (req, res) => {
  const id = req.params.id;
  const data = await UserModel.findById(id);
  let response = new APIResponse(0, "data not found")
  if (data && data.role==USER_ADMIN) {
    response = new APIResponse(1, "Data found", data)
  }
  res.send(response);
}

export const counter = async (req,res) => {
  
  const distributorCount = await UserModel.countDocuments({role : USER_DISTRIBUTOR})
  const contractorCount = await  UserModel.countDocuments({role : USER_CONTRACTOR})
  const siteCount= await SiteModel.estimatedDocumentCount();
  const batchCount= await BatchModel.estimatedDocumentCount();
  const count = {
      distributorCount,
      contractorCount,
      siteCount,
      batchCount,
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
  const unsignedCylinderCount =await CylinderModel.countDocuments({ isAssignedToDistributor:0,isAssignedToContractor:0});
  const count = {
      cylinderCount,
      filledCylinderCount,
      emptyCylinderCount,
      replacementRequestCount,
      unsignedCylinderCount,
  }

  const response = new APIResponse(1,"got counts",count)
  res.send(response)
}

