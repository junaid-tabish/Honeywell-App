import BatchModel from "../../../models/batch.js";
import UserModel from "../../../models/user.js";
import {
  APIResponse,
  containsOnlyNumbers
} from "../../../utils/common.js";
import {
  PAGE_LIMIT
} from "../../../utils/constant.js";

export const getDistributorBatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "";
    const sort = req.query.sort || "batchName";
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";
    const distributor=await UserModel.findOne({_id:req.params.id});

     const batches = await BatchModel.find(
      {
        $and: [
          {_id:{$in: distributor.assignedBatches}},
          {$or:
            [{batchName: { $regex: new RegExp(search, "i") }}]
          }
        ]
        }
     )
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
}
