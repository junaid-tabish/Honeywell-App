import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserModel from "../models/user.js";
import { USER_ADMIN } from "../utils/constant.js";
import bcrypt from "bcrypt";
dotenv.config();
mongoose.set("strictQuery", false);
// Mongoose Seeder for Admin Registration
const seedData = async () => {
  try {
    const uri = `${process.env.DATABASE_URL}${process.env.DATABASE_USERNAME}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}${process.env.DATABASE_SOURCE}`;
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DATABASE_NAME //Database name
    };
    await mongoose.connect(uri, dbOptions);
    let connClosed = false;
    const userData = await UserModel.findOne({ email: "mailto:admin@yopmail.com", role: USER_ADMIN });
    if (!userData) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("Admin#123", salt);
      const adminData = {
        name: "Admin",
        email: "mailto:admin@yopmail.com",
        role: USER_ADMIN,
        password: password,
        tc: true
      };
      const res = await new UserModel(adminData).save();
      if (res) {
        connClosed = true;
      }
    } else {
      connClosed = true;
    }
    if (connClosed) {
      mongoose.connection.close();
    }
  } catch (error) {
    console.log("error:", error);
  }
};
export default seedData;
