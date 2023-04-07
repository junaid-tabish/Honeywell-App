// import mongoose, { isObjectIdOrHexString } from "mongoose";
import mongoose from "mongoose";

const dailyScan = new mongoose.Schema({

    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
    },

    scanType: {
        type: String,
        enum: ["INBOUND", "OUTBOUND"],

    },
    counterfeitCylinders:
        [
            {
                required: false,
                type: mongoose.Schema.Types.ObjectId,
            }

        ],

    countOfScanCylinders: {
        type: Number
    },

    countOfTotalCylinders: {
        type: Number

    },

    scanCylinders: [

        {
            _id: false,

            method: {
                type: String,
                enum: ["RFID", "NFC", "MANNUAL"],

            },
            cylinderId: [

                {
                    required: false,

                    type: mongoose.Schema.Types.ObjectId,
                    // ref: "cylinder"
                }
            ]
        }
    ]


}, { timestamps: true })

const dailyScanModel = mongoose.model("dailyScan", dailyScan);
export default dailyScanModel;
