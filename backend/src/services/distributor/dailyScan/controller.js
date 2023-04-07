import { CylinderModel } from "../../../models/cylinder.js";
import cylinderTrackingModel from "../../../models/cylinderTraking.js";
import SiteModel from "../../../models/site.js";
import { APIResponse } from "../../../utils/common.js";
import dailyScanModel from "../../../models/dailyScan.js";

export const getSites = async (req, res) => {
    const id = req.params.id;
    let response = new APIResponse(0, "No data found");
    const data = await cylinderTrackingModel.find({ distributorId: id }, { "sites.siteId": 1 });
    var arr = [];
    data.map((e) => {
        e.sites.map((em) => {
            arr.push(em)
        })
    })
    const ids = arr.map(item => item.siteId);
    const documents = await SiteModel.find({ _id: { $in: ids } }, { siteName: { $concat: ["$siteName", " "] } }, { siteName: 1 });
    if (data && (arr.length > 0)) {
        response = new APIResponse(1, "Data found", documents);
    }
    res.send(response);
};


export const getCylinders = async (req, res) => {
    let response = new APIResponse(0, "No data found");
    const id = req.params.id;
    const data = await cylinderTrackingModel.find({ distributorId: id }, { "sites.cylinders": 1 });

    var newData = [];
    data.map((el) => {
        el.sites.map((el1) => {
            newData.push(el1.cylinders[0]);
        })
    });
    const doc = await CylinderModel.find({ _id: { $in: newData } });

    if (doc) {
        response = new APIResponse(1, " Data found", doc);
    }
    res.send(response);

};


export const getSitesCylinder = async (req, res) => {
    let response = new APIResponse(0, "No data found");
    let siteId = req.params.id;

    const data = await cylinderTrackingModel.find({ sites: { $elemMatch: { siteId: siteId } } },
        { "sites.$": 1 }).populate(["sites.cylinders"]);

    var newData = [];
    data.map((el) => {
        el.sites.map((el1) => {
            newData.push(el1.cylinders);
        });
    });

    if (data) {
        response = new APIResponse(1, "Data found", newData[0]);
    }
    res.send(response);
}

export const scanData = async (req, res) => {
    let response = new APIResponse(0, " Data couldn't be scanned");

    const data = new dailyScanModel({
        ...req.body
    });

    const val = await data.save();
    if (val) {
        response = new APIResponse(1, "Data scanned successfully");
    }
    res.send(response);

}

