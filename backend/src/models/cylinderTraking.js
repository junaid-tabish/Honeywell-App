// import mongoose, { isObjectIdOrHexString } from "mongoose";
import mongoose from "mongoose";

const cylinderTracking = new mongoose.Schema({

    contractorId:
    {
        required: true,
        unique: true,
        type: mongoose.Schema.Types.ObjectId,
    },

    distributorId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    sites: [
        {
            siteId: {
                required: false,
                unique: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: "site"
            },
            cylinders: [
                {
                    required: false,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "cylinder"
                }
            ]
        }
    ]


}, { timestamps: true })

const cylinderTrackingModel = mongoose.model("cylinderTracking", cylinderTracking);
export default cylinderTrackingModel;
