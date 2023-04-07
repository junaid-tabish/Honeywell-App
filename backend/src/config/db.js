import mongoose from "mongoose";

//Established mongooes database connection
const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    const uri = `${process.env.DATABASE_URL}${process.env.DATABASE_USERNAME}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}${process.env.DATABASE_SOURCE}`;
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DATABASE_NAME //Database name
    };
    await mongoose.connect(uri, dbOptions);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
