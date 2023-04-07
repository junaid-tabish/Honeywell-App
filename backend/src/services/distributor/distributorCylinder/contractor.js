import jwt from "jsonwebtoken";
import UserModel from "../../../models/user.js";
import { CylinderModel } from "../../../models/cylinder.js";
import { APIResponse } from "../../../utils/common.js";
import { PAGE_LIMIT } from "../../../utils/constant.js";

export const getCylinders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    const limit = req.query.limit || PAGE_LIMIT;
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";

    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const id = jwt.decode(token).userID;
    const data = await UserModel.findOne({ _id: id });
    const assignedBatchesList = data.assignedBatches;

    let condition = {};
    if(search && search != ""){
      condition.cylinderId = { $regex: new RegExp(search, "i")};
    }
    if(assignedBatchesList){
      condition.batchId = { $in: assignedBatchesList }
    }
    const cylinders = await CylinderModel.find(condition)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    const totalRecords = await CylinderModel.countDocuments();

    const formattedData = cylinders.map((eachObj) => {
      let fillStatus = "";
      if (eachObj["filledStatus"] === 0) {
        fillStatus = "Empty";
      } else if (eachObj["filledStatus"] === 1) {
        fillStatus = "Filled";
      } else if (eachObj["filledStatus"] === 2) {
        fillStatus = "Less Gas";
      }
      const newObj = {
        _id: eachObj["_id"],
        batchId: eachObj["batchId"]["batchId"],
        batchName: eachObj["batchId"]["batchName"],
        cylinderId: eachObj["cylinderId"],
        filledStatus: fillStatus,
        replacementRequest:eachObj["replacementRequest"],
        status: eachObj["status"] == 0 ? "Inactive" : "Active",
      };
      return newObj;
    });
    const responseData = {
      currentPage: page + 1,
      totalRecords: totalRecords,
      limit: parseInt(limit),
      previousPage: page > 0 ? page : undefined,
      lastPage: Math.ceil(totalRecords / limit),
      nextPage: totalRecords > limit * (page + 1) ? page + 2 : undefined,
      cylindersData: formattedData,
    };

    if (responseData) {
      const response = new APIResponse(1, "Data Found", responseData);
      res.status(200).send(response);
    } else {
      const response = new APIResponse(0, "Data Not Found");
      res.status(200).send(response);
    }
  } catch (error) {
    console.log(err);
    const response = new APIResponse(0, "Exception Occurs:", {
      error: err.message,
    });
    res.send(response);
  }
};
