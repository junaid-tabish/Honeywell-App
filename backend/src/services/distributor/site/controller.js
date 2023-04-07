import { APIResponse } from "../../../utils/common.js";
import siteModel from "../../../models/site.js";
import { PAGE_LIMIT } from "../../../utils/constant.js";

export const getData = async (req, res) => {
  const sites = await siteModel.find();
  let response = new APIResponse(0, "Data not found");
  if (sites) {
    response = new APIResponse(1, "Data found", sites);
  }
  res.send(response);
};

export const getActiveSites = async (req, res) => {
  const sites = await siteModel.find({ status: "1" }).sort({ siteName: 1 });
  let response = new APIResponse(0, "Data not found");
  const result = [];
  for (let data of sites) {
    result.push({
      _id: data._id,
      siteName: data.siteName,
    });
  }
  if (result) {
    response = new APIResponse(1, "Data found", result);
  }
  res.send(response);
};

export const addData = async (req, res) => {
  const siteName = await siteModel.findOne({ siteName: req.body.siteName });
  if (siteName) {
    let response = new APIResponse(0, "Site is already exists");
    res.send(response);
  } else {
    await siteModel
      .create(req.body)
      .then((data) => {
        res.send(new APIResponse(1, "Data added successfully", data));
      })
      .catch((err) => {
        res.send(new APIResponse(0, "data not added"));
      });
  }
};

export const deleteData = async (req, res) => {
  try {
    const site = await siteModel.findOne({ _id: req.params.id });
    var flag =
      site.isAssignedToContractor == "0" && site.isAssignedToDistributor == "0"
        ? 1
        : 0;
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

export const updateData = async (req, res) => {
  const { siteName, status, longitude, latitude } = req.body;
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

// search || sort || filter || pagination
export const findSites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = PAGE_LIMIT || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "createdAt";
    let order = req.query.order || "desc";

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = order;
    }

    const sites = await siteModel
      .find({
        $and: [
          {
            $or: [{ siteName: { $regex: new RegExp(search, "i") } }],
          },
        ],
      })
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    let response = new APIResponse(1, "Details found", sites);
    res.send(response);
  } catch (err) {
    let response = new APIResponse(0, "Details not found");
    res.send(response);
  }
};
