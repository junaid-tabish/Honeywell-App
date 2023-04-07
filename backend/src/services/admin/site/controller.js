import { APIResponse } from "../../../utils/common.js";
import siteModel from "../../../models/site.js";
import {
  PAGE_LIMIT,
  USER_CONTRACTOR,
  USER_DISTRIBUTOR,
} from "../../../utils/constant.js";
import UserModel from "../../../models/user.js";
import SiteModel from "../../../models/site.js";
import NotificationModel from "../../../models/notification.js";
import jwt from "jsonwebtoken";

export const getActiveSites = async (req, res) => {
  console.log(req.params.id);
  const details = await UserModel.findOne({_id:req.params.id});
  console.log(details);
  if (details.role == USER_DISTRIBUTOR) {
    var sites = await SiteModel.aggregate([
      { $match: { status: 1, isAssignedToDistributor: 0 } },
    ]);
  } else if (details.role == USER_CONTRACTOR) {
    sites = await SiteModel.aggregate([
      { $match: { status: 1, isAssignedToContractor: 0 } },
    ]);
  }
  let response = new APIResponse(0, "No details found");
  if (sites) {
    response = new APIResponse(1, "Data found", sites);
  }
  res.send(response);
};

//add site data
export const addData = async (req, res) => {
  const siteName = await siteModel.findOne({ siteName: req.body.siteName });

  if (req.body.distributorId) {
    req.body.isAssignedToDistributor = 1;
  } else {
    delete req.body.distributorId;
  }

  if (req.body.contractorId) {
    req.body.isAssignedToContractor = 1;
  } else {
    delete req.body.contractorId;
  }

  if (siteName) {
    let response = new APIResponse(0, "Site is already exists");
    res.send(response);
  } else {
    try {
      const doc = new siteModel(req.body);
      const siteDetails = await doc.save();
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      const id = jwt.decode(token).userID;
      const data = await UserModel.findOne({ _id: id });

      if (req.body.distributorId) {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.distributorId },
          { $push: { assignedSites: siteDetails._id } }
        );
        const notify = new NotificationModel({
          message: `site ${req.body.siteName} has been assigned to you by admin ${data.name}`,
          role: USER_DISTRIBUTOR,
          userId: req.body.distributorId,
        });
        await notify.save();
      }
      if (req.body.contractorId) {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.contractorId },
          { $push: { assignedSites: siteDetails._id } }
        );
        const notify = new NotificationModel({
          message: `site ${req.body.siteName} has been assigned to you by admin ${data.name}`,
          role: USER_CONTRACTOR,
          userId: req.body.contractorId,
        });
        await notify.save();
      }

      let response = new APIResponse(1, "Site Successfully Added", siteDetails);
      res.send(response);
    } catch (error) {
      let response = new APIResponse(0, "Site Not Added");
      res.send(response);
    }
  }
};

// Delete site data
export const deleteData = async (req, res) => {
  try {
    const site = await siteModel.findOne({ _id: req.params.id });
    var flag =
      site.isAssignedToContractor == "0" && site.isAssignedToDistributor == "0"
        ? 1
        : 0;
    console.log(flag);
    if (flag) {
      await siteModel.findByIdAndDelete({ _id: req.params.id });
      res.send(new APIResponse(1, "Deleted"));
    } else {
      res.send(new APIResponse(0, "Site is Alloted to someone"));
    }
  } catch (error) {
    res.send(new APIResponse(0, "Id not found"));
  }
};

//update site data
export const updateData = async (req, res) => {
  const {
    siteName,
    status,
    longitude,
    latitude,
    isAssignedToContractor,
    isAssignedToDistributor,
  } = req.body;
  const siteData = await siteModel.findOne({ siteName });
  if (!siteData || siteData._id == req.params.id) {
    await siteModel
      .updateOne(
        { _id: req.params.id },
        {
          $set: {
            siteName: siteName,
            status: status,
            longitude: longitude,
            latitude: latitude,
            isAssignedToContractor: isAssignedToContractor,
            isAssignedToDistributor: isAssignedToDistributor,
          },
        }
      )
      .then((result) => {
        res.send(new APIResponse(1, "Site updated successfully", result));
      })
      .catch((err) => {
        res.send(new APIResponse(0, "Error while updating"));
      });
  } else {
    let response = new APIResponse(0, "Site name is already exist.");
    res.send(response);
  }
};

// Dropdown -1   get all active distributors
export const getActiveDistributors = async (req, res) => {
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

//getting sites alloted to Contractor
export const getContractorsAllocatedToDistributor = async (req, res) => {
  let response = new APIResponse(0, "No details forunds");
  let id = req.params.id;
  console.log(id);
  const data = await UserModel.find(
    { distributorId: id },
    { name: { $concat: ["$name", " ", "(", "$email", ")"] } },
    { contractorId: 1, name: 1, email: 1 }
  );
  if (data) {
    console.log(data);
    response = new APIResponse(1, "msg", data);
  }
  res.send(response);
};

// search || sort || filter || pagination
export const findSites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    let sortBy = {};
    sortBy[sort] = req.query.order || "desc";

    const sites = await siteModel
      .find({ siteName: { $regex: new RegExp(search, "i") } })
      .populate(["distributorId", "contractorId"])
      .sort(sortBy)
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    let response = new APIResponse(0, "Details not found");
    if (sites) {
      response = new APIResponse(1, "Details found", sites);
    }
    res.send(response);
  } catch (err) {
    const response = new APIResponse(0, "Exception Occurs:", {
      error: err.message,
    });
    res.send(response);
  }
};
