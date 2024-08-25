"use server";

import mongoose from "mongoose";
import dotenv from "dotenv";
// import User from "@/models/user.model.js";

dotenv.config();

const dbConnection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI not found in .env file");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    // const admin = new User({
    //   username: "admin",
    //   password: "admin",
    //   type: "admin",
    // });

    // const existingAdmin = await User.findOne({ username: "admin" });
    // if (existingAdmin) {
    //   console.log("Admin already exists");
    //   return;
    // }
    // await admin.save();
    // console.log("Admin created successfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
};

export default dbConnection;
