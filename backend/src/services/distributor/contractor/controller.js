import { APIResponse } from "../../../utils/common.js";
import UserModel from "../../../models/user.js";
import cylinderTrackingModel from "../../../models/cylinderTraking.js";
import { USER_CONTRACTOR, PAGE_LIMIT, USER_DISTRIBUTOR } from "../../../utils/constant.js";
import SiteModel from "../../../models/site.js";
import jwt from 'jsonwebtoken';
import BatchModel from "../../../models/batch.js";
import { CylinderModel } from "../../../models/cylinder.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

//add contractor and add contractor and distributor by admin
const addContractor = async (req, res) => {
  const { name, email, role, password, distributorId } = req.body;
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  const contractor = await UserModel.findOne({ email });
  let response;
  if (contractor) {
    response = new APIResponse(0, "Contractor already exists!");
    res.send(response);
  } else {
    const doc = new UserModel({
      name,
      email,
      role,
      password:hashPassword,
      distributorId,
    });
    const responseData = await doc.save();
    response = new APIResponse(1, "Contractor added successfully!");
    res.send(response);
  }
};

//get  all contractor details
const getContractorsByRole = async (req, res) => {

    const contractors = await UserModel.find({ "role": "Contractor" })
    let response;
    if (!contractors) {
        response = new APIResponse(0, "No details found");
    }
    else {
        response = new APIResponse(1, "Data found", contractors);
        // res.send(response);
    }
    res.send(response);
}

//get contractor by Id
const getContractorById = async (req, res) => {
  const contractor = await UserModel.findById(req.params.id);
  let response;
  if (!contractor) {
    response = new APIResponse(0, "No data found");
  } else {
    response = new APIResponse(1, " Data found ", contractor);
  }
  res.send(response);
};

const findContractor = async (req, res) => {
    try {
        const { authorization } = req.headers
        const token = authorization.split(' ')[1];
        const decoded = jwt.decode(token).userID;
      const page = parseInt(req.query.page) - 1 || 0;
      const search = req.query.search || "";
      const sort = req.query.sort || "createdAt";
      const limit = req.query.limit || PAGE_LIMIT;
      let sortBy = {};
      sortBy[sort] = req.query.order || "desc";
  
      const contractors = await UserModel.find({
        $and: [
          {distributorId:decoded },
          {
            $or: [{ name: { $regex: new RegExp(search, "i") } }, { email: { $regex: new RegExp(search, "i") } }],
          },
        ],
      })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
      const totalRecords = await UserModel.countDocuments({ role: USER_CONTRACTOR });
      const responseData = {
        currentPage: page + 1,
        totalRecords: totalRecords,
        limit: parseInt(limit),
        previousPage: page > 0 ? page : undefined,
        lastPage: Math.ceil(totalRecords / limit),
        nextPage: totalRecords > limit * (page + 1) ? page + 2 : undefined,
        contractorsData: contractors,
      };
      
  
      let response = new APIResponse(0, "Details not found");
      if (contractors) {
        response = new APIResponse(1, "Details found", responseData);
      }
      res.send(response);
    } catch (err) {
      console.log(err);
      const response = new APIResponse(0, "Exception Occurs:", { error: err.message });
      res.send(response);
    }
  };

// Delete a Contractor
const deleteContractor = async (req, res) => {
     const contractor = await UserModel.findById(req.params.id);
     const distributor= await cylinderTrackingModel.findOne({ contractorId: contractor._id})
     let response;
     if ((distributor.distributorId)){
        response=new APIResponse(0," Contractor is assigned to distributor")
        res.send(response)
     }else{
        const updateSite = await SiteModel.updateMany({ _id: { $in: contractor.assignedSites } },
            { $set: { isAssignedToContractor:  0} },
            { multi: true })
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
        response = new APIResponse(0, "No details found");
        res.send(response);
        return;
    }
    response = new APIResponse(1, "Contractor deleted successfully");
    res.send(response);}
}

//get all active contractors
const getActiveContractors = async (req, res) => {
    const contractors = await UserModel.aggregate([
        { $match: { "status": 1, role: USER_CONTRACTOR } },
        { $sort: { "name": -1 } },
        { $project: { name: { $concat: ["$name", " ", "(", "$email", ")"] } } }
    ]);
    let response = new APIResponse(0, "No details found");
    if (contractors) {
        response = new APIResponse(1, "Data found", contractors);
    }
    res.send(response);
}
// //update contractor details
const updateContractor = async (req, res) => {

  const requestBody = req.body;
  await UserModel.findByIdAndUpdate(req.params.id, requestBody);
  const updated = await UserModel.findById(req.params.id);
  const response = new APIResponse(1, "User Updated ", updated);
  res.status(201).send(response);}
    

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Allot sites to distributor module API's
  //allot sites to contractor details
const updateContractorSites = async (req, res) => {
  const id=req.params.id;
  const contractors = await UserModel.findById(id);
  let response = new APIResponse(0, "Contractor not found");
  var roleWiseUpdate = contractors.role == USER_DISTRIBUTOR ? "isAssignedToDistributor" : "isAssignedToContractor"
  if (contractors) {
    const sites = req.body;
    const updateContractor = await UserModel.findByIdAndUpdate({ _id: req.params.id }, { $push: {assignedSites:sites} });
    const updated=await UserModel.findById(id);
    const updateSite = await SiteModel.updateMany({ _id: { $in: updated.assignedSites } },
      { $set: { [roleWiseUpdate]: 1 } },
      { multi: true }
    ) 
    response = new APIResponse(1, "Contractor updated successfully", updateContractor);
  }

  res.send(response);
};
//getting all sites that can be alloted to contractor by the distributor
const getContractorSites = async (req, res) => {
  const contractor = await UserModel.findOne({ _id: req.params.id });
  const distributor = await UserModel.findOne({ _id: contractor.distributorId });
  const sites = await SiteModel.aggregate([{ $match: { _id:{$in:distributor.assignedSites},status: 1, isAssignedToContractor: 0 } }]);
  let response = new APIResponse(1, "got list", sites);
  res.send(response);
};

//getting sites alloted to Contractor
const getSitesOfContractor = async (req, res) => {
  const contractor = await UserModel.findById(req.params.id);
  const allocatedSites = await SiteModel.find({ _id: { $in: contractor.assignedSites } });
  let response = new APIResponse(1, " Contractor by Id", allocatedSites);

  res.send(response);
};


//removing site alloted to a Contractor
const deleteAllotedSite = async (req, res) => {
  const site = req.body._id;
  const id = req.params.id;
  const  result=await cylinderTrackingModel.findOne( { sites: { $elemMatch: { siteId: site } } },{ "sites.$": 1 },{siteId:0})
   if (!result) {
  const user = await UserModel.updateOne({ _id: id }, { $pull: { assignedSites: site } });
  const updateSite = await SiteModel.updateOne({ _id: site }, { $set: { isAssignedToContractor: 0 } });
  res.send(new APIResponse(1, "Site is Removed"));
   }else if(result){
    const value=result.sites[0].cylinders.length
      if(value==0){
  const user = await UserModel.updateOne({ _id: id }, { $pull: { assignedSites: site } });
  const updateSite = await SiteModel.updateOne({ _id: site }, { $set: { isAssignedToContractor: 0 } });
  res.send(new APIResponse(1, "Site is Removed"));
}
  else if(value>0){
    res.send(new APIResponse(0, "Cylinders are alloted to the site"))
  }
   }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Assign Cylinder module Api's
//distributor assign cylinder to contractor
const assignCylinder=async(req,res)=>{ 
  const id=req.params.id
  const{distributorId,siteId,cylinders}=req.body
  const contractor= await cylinderTrackingModel.findOne({contractorId:id})
  if (!contractor){
     await new cylinderTrackingModel({
      contractorId: id,
       distributorId,
    }).save();
  }
  const update= await cylinderTrackingModel.updateOne(  
    {
      "sites.siteId" :  siteId
    },
    { 
      $push: {"sites.$[site].cylinders":cylinders} 
    },{arrayFilters:[{"site.siteId":siteId}]})
    if(update.matchedCount){
      await CylinderModel.updateMany({ _id: { $in: cylinders } },
        { $set: { isAssignedToContractor: 1,isAssignedToDistributor:1 } },
        { multi: true }
      ) 
      res.send(new APIResponse(1,"cylinder assigned"))
    }
    else if(!update.matchedCount){
  const updateSite= await cylinderTrackingModel.updateOne(
    {"contractorId" :  id},
    { $push: {sites:{"siteId":siteId}} }
    )
  const update= await cylinderTrackingModel.updateOne(  
    {"sites.siteId" :  siteId},
    { $push: {"sites.$[].cylinders":cylinders} })
    await CylinderModel.updateMany(
      { _id: { $in: cylinders } },
      { $set: { isAssignedToContractor: 1,isAssignedToDistributor:1 } },
      { multi: true }
    )
    res.send(new APIResponse(1,"Assigned with Site"))
}
}

//details of cylinders in batch from batchid
const cylindersOfBatch=async(req,res)=>{
  const id= req.params.id
  const cylinder=await CylinderModel.aggregate([{ $match: { status: 1, isAssignedToContractor:0  ,batchId :mongoose.Types.ObjectId(id)} }])
  res.send(new APIResponse(1,"Cylinder in the batch",cylinder))
}

//details of batches alloted to distributor
const detailsOfBatch=async(req,res)=>{
  const distributorId=req.params.id
  const distributor= await UserModel.findOne({_id:distributorId});
  const batches=await  BatchModel.find({_id: { $in: distributor.assignedBatches }})
  res.send(batches)
}

export {updateContractorSites,cylindersOfBatch,detailsOfBatch,assignCylinder, addContractor,getSitesOfContractor, getContractorsByRole,deleteAllotedSite, getContractorById, findContractor,getContractorSites, updateContractor, deleteContractor, getActiveContractors };
