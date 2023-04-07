import cylinderTrackingModel from "../../../models/cylinderTraking.js";
import UserModel from "../../../models/user.js";
import { APIResponse } from "../../../utils/common.js";
import SiteModel from "../../../models/site.js";
import { PAGE_LIMIT } from "../../../utils/constant.js";

// Dropdown-1   get all active distributors
const getActiveDistributors = async (req, res) => {
  let response = new APIResponse(0, "No data found");
  const data = await cylinderTrackingModel.distinct("distributorId");

  const records = await UserModel.find(
    { _id: { $in: data } },
    { name: { $concat: ["$name", " ", "(", "$email", ")"] } },
    { name: 1, email: 1 }
  );

  if (records) {
    response = new APIResponse(1, "Data found", records);
  }
  res.send(response);
};

// Dropdown-2 getContractors Allocated to selected distributor
const getActiveContractors = async (req, res) => {
  let response = new APIResponse(0, "No data found");
  const id = req.params.id;
  const data = await cylinderTrackingModel.find(
    { distributorId: id },
    { _id: 0, contractorId: 1 }
  );
  const ids = data.map((item) => item.contractorId);
  const documents = await UserModel.find(
    { _id: { $in: ids } },
    { name: { $concat: ["$name", " ", "(", "$email", ")"] } },
    { name: 1, email: 1 }
  );
  if (documents) {
    response = new APIResponse(1, "Data found", documents);
  }
  res.send(response);
};

// Dropdown-3 getSites Allocated to selected contractor
const getActiveSites = async (req, res) => {
  let response = new APIResponse(0, "No data found");
  const id = req.params.id;
  const data = await cylinderTrackingModel.findOne(
    { contractorId: id },
    { _id: 0, sites: 1 }
  );

  const ids = data.sites.map((item) => item.siteId);
  const documents = await SiteModel.find(
    { _id: { $in: ids } },
    { siteName: { $concat: ["$siteName", " "] } },
    { siteName: 1 }
  );
  if (documents) {
    response = new APIResponse(1, "Data found", documents);
  }
  res.send(response);
};

// functioin called when page loads
const getActiveCylinders = async (req, res) => {
  let response = new APIResponse(0, "No data found");
  const data = await cylinderTrackingModel
    .find({}, { sites: 1 })
    .populate(["sites.siteId", "sites.cylinders"]);

  var newData = [];
  data.map((el) => {
    if (el.sites !== null) {
      el.sites.map((elem) => {
        newData = [
          ...newData,
          { siteName: elem.siteId.siteName, cylinders: elem.cylinders[0] },
        ];
      });
    }
  });

  if (newData) {
    response = new APIResponse(1, "Data found", newData);
  }
  res.send(response);
};


//API called On Search Press
const getCylinders = async (req, res) => {
  var response = new APIResponse(0, "No data found");
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = req.query.limit || PAGE_LIMIT;
  let { distributorId, contractorId, siteId } = req.query;
  let findParameter = {};

  if (distributorId && contractorId && siteId) {
    findParameter = [
      {
        $and: [
          { distributorId: distributorId },
          { contractorId: contractorId },
          { sites: { $elemMatch: { siteId: siteId } } },
        ],
      },
      { "sites.$": 1 },
    ];
  } else if (distributorId && contractorId) {
    findParameter = [
      {
        $and: [
          { distributorId: distributorId },
          { contractorId: contractorId },
        ],
      },
    ];
  } else if (contractorId && siteId) {
    findParameter = [
      {
        $and: [
          { contractorId: contractorId },
          { sites: { $elemMatch: { siteId: siteId } } },
        ],
      },
      { "sites.$": 1 },
    ];
  } else if (distributorId) {
    findParameter = [{ distributorId: distributorId }];
  } else if (siteId) {
    findParameter = [
      { sites: { $elemMatch: { siteId: siteId } } },
      { "sites.$": 1 },
    ];
  }

  var data;
  if (findParameter.length) {
    data = await cylinderTrackingModel
      .findOne(...findParameter)
      .populate(["sites.siteId", "sites.cylinders"])
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
  } else {
    data = await cylinderTrackingModel
      .findOne()
      .populate(["sites.siteId", "sites.cylinders"])
      .skip(page * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
  }

  if (data) {
    var newData = [];
    data.sites.map((el) => {
      el.cylinders.map((elem) => {
        newData = [
          ...newData,
          { siteName: el.siteId.siteName, cylinders: elem },
        ];
      });
    });
    if (newData) {
      response = new APIResponse(1, "Data found", newData);
      res.send(response);
    }
  }
};

export {
  getActiveDistributors,
  getActiveContractors,
  getActiveSites,
  getActiveCylinders,
  getCylinders,
};
