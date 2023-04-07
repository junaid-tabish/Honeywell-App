import mongoose from "mongoose";
const siteSchema = new mongoose.Schema({
    siteName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
    },
    distributorId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      contractorId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    isAssignedToDistributor: {
        type: Number,
        required: false,
        enum: [0, 1],
        default: 0
    },
    isAssignedToContractor: {
        type: Number,
        required: false,
        enum: [0, 1],
        default: 0
    },
    status: {
        type: Number,     // 0 for Inactive site
        require: true,    // 1 for Active site
        enum: [0, 1],
        default: 0
    }
}, { timestamps: true })

const SiteModel = mongoose.model("site", siteSchema);
export default SiteModel;
