import mongoose from "mongoose";
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../utils/constant.js";

// Defining user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: [USER_ADMIN, USER_DISTRIBUTOR, USER_CONTRACTOR],
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  distributorId: {
    required: false,
    type: mongoose.Schema.Types.ObjectId,

  },
  assignedSites:
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        enum: [0, 1],
        default: 0
      }
    ],
  status: {
    type: Number,     // 0 for Inactive user
    require: true,    // 1 for Active user
    enum: [0, 1],
    default: 1
  },
  assignedSites:
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      }
    ],
  assignedBatches:
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      }
    ],

  tc: {
    type: Boolean,
    required: false
  }
}, { timestamps: true });

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;