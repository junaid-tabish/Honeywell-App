import BatchModel from "../../../models/batch.js";
import { CylinderModel } from "../../../models/cylinder.js";
import { APIResponse, containsOnlyNumbers } from "../../../utils/common.js";
import { ACTIVE } from "../../../utils/constant.js";
import { PAGE_LIMIT } from "../../../utils/constant.js";

export const addBatch = async (req, res) => {
  const { batchId, batchName, status } = req.body;
  const batch = await BatchModel.findOne({ batchId: batchId });

  if (batch) {
    const response = new APIResponse(0, "Batch already exist");
    res.send(response);
  } else {
    const doc = new BatchModel({ batchId, batchName, status });
    await doc.save();
    const response = new APIResponse(1, "Batch Added");
    res.status(201).send(response);
  }
};

export const updateBatch = async (req, res) => {
  let batch = await BatchModel.findById(req.params.id);
  if (!batch) {
    res.status(404).send(new APIResponse(0, `Batch  not found`));
    return;
  }

  const requestBody = req.body;
  await BatchModel.findByIdAndUpdate(req.params.id, requestBody);
  const updatedBatch = await BatchModel.findById(req.params.id);
  const response = new APIResponse(1, "Batch Updated ", updatedBatch);
  res.status(201).send(response);
};

export const deleteBatch = async (req, res) => {
  const id = req.params.id;
  const cylinder = await CylinderModel.find({ batchId: id });
  if (cylinder.length == 0) {
    const batch = await BatchModel.findByIdAndDelete(id);
    if (!batch) {
      const response = new APIResponse(0, "Batch  not found");
      res.send(response);
    }
    const response = new APIResponse(1, "Batch deleted");
    res.send(response);
  } else {
    res.send(new APIResponse(0, "Batch Consist Cylinders"));
  }
};

// search || sort || filter || pagination
export const findBatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";
    let condition = {batchName: { $regex: new RegExp(search, "i") }};
    if(search && containsOnlyNumbers(search)){
      condition = { $or: [{batchName: { $regex: new RegExp(search, "i") }}, {batchId: parseInt(search)}]};
    }
    const batches = await BatchModel.find(condition)
      .sort(sortBy)
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    let response = new APIResponse(0, "Details not found");
    if (batches) {
      response = new APIResponse(1, "Details found", batches);
    }
    res.send(response);
  } catch (err) {
    const response = new APIResponse(0, "Exception Occurs:", { error: err.message });
    res.send(response);
  }
};

//get all active batches
export const getActiveBatches = async (req, res) => {
  const batches = await BatchModel.aggregate([{ $match: { status: 1 } }, { $sort: { batchName: 1 } }]);
  let response = new APIResponse(0, "No details found");
  if (batches) {
    response = new APIResponse(1, "Data found", batches);
  }
  res.send(response);
};

export const viewBatchId = async (req, res) => {
  const batch = await BatchModel.findById(req.params.id);
  if (!batch) {
    const response = new APIResponse(0, "No data found");
    res.send(response);
    return;
  }
  const response = new APIResponse(1, "Data found ", batch);
  res.status(200).send(response);
};
