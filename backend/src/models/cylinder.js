import mongoose from "mongoose";
import autoPopulate from "mongoose-autopopulate";
import { PAGE_LIMIT } from "../utils/constant.js";


const cylinderSchema = new mongoose.Schema(
  {
    cylinderId: {
      type: String,
      unique: true,
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch",
      autopopulate: { select: "batchName batchId" },
    },
    filledStatus: {
      type: Number,
      required: true,
      enum: [0, 1, 2], //true for filled cylinder
      default: 1, //false for empty cylinder
    },
    counterfitStatus: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 0,

    },
    replacementRequest: {
      type: Number,
      required: true,
      enum: [0,1,2,3],//0-default,1-requested,2-accepted,3-rejected
      default: 0, // true for
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 for Inactive cylinder
      default: 1, // 1 for Active cylinder
    },
    isAssignedToDistributor: {
      type: Number,
      required: false,
      enum: [0, 1],
      default: 0
    },
    isAssignedToContractor: {
      type: Number,
      required: false,
      enum: [0, 1],
      default: 0
    },
  },
  { timestamps: true, versionKey: false }
);

cylinderSchema.plugin(autoPopulate);

export const CylinderModel = mongoose.model("cylinder", cylinderSchema);

//finding cylinder details with cylinder id if exist any..
export const getCylinderDetails = async (cylinderId) => {
  try {
    const cylinder = await CylinderModel.findOne({ cylinderId: cylinderId });
    return cylinder === null ? false : true;
  } catch (error) {
    console.log(error);
  }
};

//adding new cylinder details
export const addNewcylinder = (reqBody) => {
  try {
    return new Promise(async (resolve, reject) => {
      CylinderModel.create(reqBody, (err) => {
        if (err) {
          console.log(err);
          resolve(0); //here am returing 0 if we get any error while inserting data into DB
        } else {
          resolve(1); //returning 1 on successful insertion of details
        }
      });
    });
  } catch ({ error }) {
    console.log(error);
  }
};

//get all cylinders
export const getAllCylinders = async (req, res) => {
  try {
    // const data = await CylinderModel.find();
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "1";
    const sort = req.query.sort || "createdAt";
    const limit = req.query.limit || PAGE_LIMIT;
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";
    const condition = { cylinderId: { $regex: new RegExp(search, "i") } }
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
        replacementRequest: eachObj["replacementRequest"] === true ? "True" : "False",
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
    return responseData;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//update cylinder
export const updateCylinderDetails = async (req) => {
  try {
    return new Promise(async (resolve, reject) => {
      const { filledStatus, batchId, replacementRequest, status } = req.body;
      const isCylinderExist = await CylinderModel.findById(req.params.id);
      const newData = {};
      if (filledStatus === undefined || filledStatus === "") {
        newData["filledStatus"] = isCylinderExist["filledStatus"];
      } else {
        newData["filledStatus"] = filledStatus;
      }

      newData["batchId"] = batchId === undefined || batchId === "" ? isCylinderExist["batchId"]["_id"] : batchId;
      newData["replacementRequest"] = replacementRequest === undefined || batchId === "" ? isCylinderExist["replacementRequest"] : replacementRequest;
      newData["status"] = status === undefined || batchId === "" ? isCylinderExist["status"] : status;

      if (isCylinderExist) {
        CylinderModel.findByIdAndUpdate(req.params.id, newData, (err, result) => {
          if (err) {
            console.log(err);
            resolve(0); //here am returing 0 if we get any error while inserting data into DB
          } else {
            resolve(1); //returning 1 on successful insertion of details
          }
        });
      } else {
        resolve(0);
      }
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
};

//getting specific cylinder details
export const getSpecificCylinderData = async (req) => {
  try {
    const data = await CylinderModel.findById(req.params.id);
    let fillStatus = "";
    if (data["filledStatus"] === 0) {
      fillStatus = "Empty";
    } else if (data["filledStatus"] === 1) {
      fillStatus = "Filled";
    } else if (data["filledStatus"] === 2) {
      fillStatus = "Less Gas";
    }
    const newObj = {
      _id: data["_id"],
      batchId: data["batchId"]["_id"],
      batchName: data["batchId"]["batchName"],
      cylinderId: data["cylinderId"],
      filledStatus: fillStatus,
      replacementRequest: data["replacementRequest"] === true ? "True" : "False",
      status: data["status"] == 0 ? "Inactive" : "Active",
    };
    return newObj;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//delete cyinder
export const deleteCylinderDetails = async (id) => {
  try {
    const cylinder = await CylinderModel.findByIdAndDelete(id);
    return cylinder;
  } catch (error) {
    return null;
  }
};

//formatting below data
const formatDadta = (data) => {
  const formattedList = data.map((eachObj) => {
    return { _id: eachObj["_id"], cylinderId: eachObj["cylinderId"] };
  });
  return formattedList;
};

//get all cylinders on batch status
export const getCylindersOnBatchStatus = async (req) => {
  try {
    const { id } = req.query;
    if (id === "" || id === undefined) {
      const data = await CylinderModel.find({ status: 1 });
      if (data.length === 0) {
        return data;
      }
      return formatDadta(data);
    } else {
      const data = await CylinderModel.find({ status: 1, batchId: id });
      if (data.length === 0) {
        return data;
      }
      return formatDadta(data);
    }
  } catch (error) {
    return null;
  }
};

export const getDocumentsCount = async () => {
  try {
    const timeStamp = +new Date();
    const documetsCount = await CylinderModel.countDocuments();
    const cylinderId = timeStamp + documetsCount.toString();
    return cylinderId;
  } catch (error) {
    console.log(error);
  }
};
