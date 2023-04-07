import { APIResponse } from "../../../utils/common.js";
import UserModel from "../../../models/user.js";
import { USER_DISTRIBUTOR, PAGE_LIMIT } from "../../../utils/constant.js";
import cylinderTrackingModel from "../../../models/cylinderTraking.js";
import SiteModel from "../../../models/site.js";
import BatchModel from "../../../models/batch.js";
import bcrypt from 'bcrypt'
import NotificationModel from "../../../models/notification.js";
import jwt from 'jsonwebtoken'

//add distributor
const addDistributor = async (req, res) => {
  const { name, email, role, password } = req.body;
  const distributor = await UserModel.findOne({ email });
  let response;
  if (distributor) {
    response = new APIResponse(0, "Distributor already exists");
    res.send(response);
  } else {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const doc = new UserModel({ name, email, role, password: hashPassword });
    const distributorData = await doc.save();

    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const id = jwt.decode(token).userID;
    const data = await UserModel.findOne({ _id: id });

    const notify = new NotificationModel({message: `You are added as Distributor by admin ${data.name}`, role: USER_DISTRIBUTOR,userId: distributorData._id})
    await notify.save()
    response = new APIResponse(1, "Distributor added successfully");
    res.send(response);
  }
};

//get all active distributors
const getActiveDistributors = async (req, res) => {
  const distributors = await UserModel.aggregate([
    { $match: { status: 1, role: USER_DISTRIBUTOR } },
    { $sort: { name: 1 } },
    { $project: { name: { $concat: ["$name", " ", "(", "$email", ")"] } } },
  ]);
  let response = new APIResponse(0, "No details found");
  if (distributors) {
    response = new APIResponse(1, "Data found", distributors);
  }
  res.send(response);
};

//get the sites not assigned to any distributor
const getDistributorSites = async (req, res) => {
  const details = await UserModel.findById(req.params.id);
  const sites = await SiteModel.aggregate([
    { $match: { status: 1, isAssignedToDistributor: 0 } },
  ]);
  let response = new APIResponse(0, "No details found");
  if (sites) {
    response = new APIResponse(1, "Data found", sites);
  }
  res.send(response);
};

//get distributor by Id
const getDistributorById = async (req, res) => {
  const distibutors = await UserModel.findById(req.params.id);
  let response = new APIResponse(0, "No details found for given Id");
  if (distibutors) {
    response = new APIResponse(1, "Distributor by Id", distibutors);
  }
  res.send(response);
};

//update distributor
const updateDistributor = async (req, res) => {
  try {
    const requestBody = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, requestBody);
    const updated = await UserModel.findById(req.params.id);
    const response = new APIResponse(1, "User Updated ", updated);
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    const response = new APIResponse(0, "Exception Occurs:", {
      error: err.message,
    });
    res.send(response);
  }
  
}

/* add sites to distributor */
const addSitesToDistributor = async (req, res) => {
  const id = req.params.id;
  const distributor = await UserModel.findById(id);
  let response = new APIResponse(0, "Distributor not found");
  var roleWiseUpdate =
    distributor.role == USER_DISTRIBUTOR
      ? "isAssignedToDistributor"
      : "isAssignedToContractor";
  if (distributor) {
    const sites = req.body;
    const updateDistributor = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { assignedSites: sites } }
    );
    const updated = await UserModel.findById(id);
    const updateSite = await SiteModel.updateMany(
      { _id: { $in: updated.assignedSites } },
      { $set: { [roleWiseUpdate]: 1 } },
      { multi: true }
    )

    await SiteModel.updateMany({ _id: { $in: sites } },
      { $set: { distributorId: id } }
    )
    //notification
    let siteNames = ''

    for (let each of sites){
      const siteName = await SiteModel.findOne({_id: each}).select('siteName')
      if(siteNames === ''){
        siteNames = siteName.siteName
      }else{
        siteNames = siteNames+", "+siteName.siteName
      }
    }

    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const adminId = jwt.decode(token).userID;
    const admin = await UserModel.findOne({ _id: adminId });

    const notify = new NotificationModel({message: `sites ${siteNames} has been assigned to you by admin ${admin.name}`, role: USER_DISTRIBUTOR,userId: req.params.id})
    await notify.save()
    
    response = new APIResponse(1, "Site Assigned successfully!", updateSite);
  }

  res.send(response);
};

// //update contractor details
// const updateContractor = async (req, res) => {

//     const contractor = await UserModel.findById(req.params.id);
//     let response;
//     console.log('update called');
//     if (!contractor) {
//         // res.status(404).send(`Batch  not found`);
//         response = new APIResponse(0, "No details found")
//         res.send(response);
//         return;
//     }
//     const requestBody = req.body;
//     console.log(requestBody);
//     const updateContractor = await UserModel.updateOne({ _id: req.params.id }, { $set: requestBody });//diectlu update the data

//     response = new APIResponse(1, "Contractor updated successfully", updateContractor);
//     res.send(response);
// }

/* Update Distributor */
const updateDistributorBatch = async (req, res) => {
  const id = req.params.id;
  const distributor = await UserModel.findById(id);
  let response = new APIResponse(0, "Distributor not found");
  var roleWiseUpdate =
    distributor.role == USER_DISTRIBUTOR
      ? "isAssignedToDistributor"
      : "isAssignedToContractor";
  if (distributor) {
    const batches = req.body;
    const updateDistributor = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { assignedBatches: batches } }
    );
    const updated = await UserModel.findById(id);
    const updateBatch = await BatchModel.updateMany(
      { _id: { $in: updated.assignedBatches } },
      { $set: { [roleWiseUpdate]: 1 } },
      { multi: true }
    )

    //notification
    let batchNames = ''

    for (let each of batches){
      const batchName = await BatchModel.findOne({_id: each}).select('batchName')
      if(batchNames === ''){
        batchNames = batchName.batchName
      }else{
        batchNames = batchNames+", "+batchName.batchName
      }
    }

    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const adminId = jwt.decode(token).userID;
    const admin = await UserModel.findOne({ _id: adminId });

    const notify = new NotificationModel({message: `batches ${batchNames} has been assigned to you by admin ${admin.name}`, role: USER_DISTRIBUTOR,userId: req.params.id})
    await notify.save()


    response = new APIResponse(1, "Batch Assigned successfully!", updateBatch);
  }

  res.send(response);
};

//delete distributor details
const deleteDistributor = async (req, res) => {
  const distributor = await UserModel.findById(req.params.id);
  const contractor = await cylinderTrackingModel.findOne({
    distributorId: distributor._id,
  });
  let response;
  if (contractor) {
    response = new APIResponse(0, " Distributor has contractors assigned ");
    res.send(response);
  } else {
    const updateSite = await SiteModel.updateMany(
      { _id: { $in: distributor.assignedSites } },
      { $set: { isAssignedToDistributor: 0 } },
      { multi: true }
    );
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      response = new APIResponse(0, "No details found");
      res.send(response);
      return;
    }
    response = new APIResponse(1, "Distributor deleted successfully");
    res.send(response);
  }
};

// search || sort || filter || pagination
const findDistributor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";

    const distributors = await UserModel.find({
      $and: [
        { role: USER_DISTRIBUTOR },
        {
          $or: [
            { name: { $regex: new RegExp(search, "i") } },
            { email: { $regex: new RegExp(search, "i") } },
          ],
        },
      ],
    })
      .sort(sortBy)
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    let response = new APIResponse(0, "Details not found");
    if (distributors) {
      response = new APIResponse(1, "Details found", distributors);
    }
    res.send(response);
  } catch (err) {
    const response = new APIResponse(0, "Exception Occurs:", {
      error: err.message,
    });
    res.send(response);
  }
};

//getting sites alloted to Contractor
const getAllotedSitesOfDistributors = async (req, res) => {
  const distributor = await UserModel.findById(req.params.id);
  const allocatedSites = await SiteModel.find({
    _id: { $in: distributor.assignedSites },
  });
  let response = new APIResponse(1, " Data Found ", allocatedSites);
  res.send(response);
};

//removing site alloted to Distributor
const updateAllotedSite = async (req, res) => {
  const site = req.body._id;
  const id = req.params.id;
  const user = await UserModel.updateOne(
    { _id: id },
    { $pull: { assignedSites: site } }
  );
  const response = new APIResponse(1, "Site is Removed");
  const updateSite = await SiteModel.updateOne({ _id: site },
    { $set: { isAssignedToDistributor: 0 } },
  )

  //notification
  const siteName = await SiteModel.findOne({_id: site}).select('siteName')
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const adminId = jwt.decode(token).userID;
  const admin = await UserModel.findOne({ _id: adminId });
  const notify = new NotificationModel({message: `site ${siteName.siteName} has been removed from you by admin ${admin.name}`, role: USER_DISTRIBUTOR,userId: req.params.id})
  await notify.save()

  res.send(response)
}

//get the sites not assign  ed to any distributor
const getDistributorBatch = async (req, res) => {
  const details = await UserModel.findById(req.params.id);
  const batches = await BatchModel.aggregate([
    { $match: { status: 1, isAssignedToDistributor: 0 } },
  ]);
  let response = new APIResponse(0, "No details found");
  if (batches) {
    response = new APIResponse(1, "Data found", batches);
  }
  res.send(response);
};
//getting sites alloted to Contractor
const getAllotedBatchesOfDistributors = async (req, res) => {
  const distributor = await UserModel.findById(req.params.id);
  const allocatedBatches = await BatchModel.find({
    _id: { $in: distributor.assignedBatches },
  });
  let response = new APIResponse(1, " Data Found ", allocatedBatches);
  res.send(response);
};

//removing batches alloted to Distributor
const updateAllotedBatch = async (req, res) => {
  const batch = req.body._id;
  const id = req.params.id;
  const user = await UserModel.updateOne(
    { _id: id },
    { $pull: { assignedBatches: batch } }
  );
  const response = new APIResponse(1, "Batch is Removed");
  const updateBatch = await BatchModel.updateOne({ _id: batch },
    { $set: { isAssignedToDistributor: 0 } },
  )
  //notification
  const batchName = await BatchModel.findOne({_id: batch}).select('batchName')
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const adminId = jwt.decode(token).userID;
  const admin = await UserModel.findOne({ _id: adminId });
  const notify = new NotificationModel({message: `Batch ${batchName.batchName} has been removed from you by admin ${admin.name}`, role: USER_DISTRIBUTOR,userId: req.params.id})
  await notify.save()

  res.send(response)
}


export { addDistributor, getDistributorBatch, getAllotedBatchesOfDistributors, updateAllotedBatch, getDistributorSites, getDistributorById, updateDistributor, updateAllotedSite, getAllotedSitesOfDistributors, getActiveDistributors, findDistributor, deleteDistributor, updateDistributorBatch, addSitesToDistributor };
