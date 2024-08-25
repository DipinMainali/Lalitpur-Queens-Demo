import dotenv from "dotenv";
import mongoose from "mongoose";
import dbConnection from "@/utils/dbconnection.js";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
const User = mongoose.models?.User || mongoose.model("User", userSchema);

dotenv.config();

const Admin = {
  username: "superadmin",
  password: "adminsuper",
  type: "admin",
};

const createAdmin = async () => {
  try {
    await dbConnection();
    const user = await User.findOne({ type: "admin" });
    if (!user) {
      await User.create(Admin);
      console.log("Admin has been created successfully ");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.log(error);
  }
};
export default createAdmin;
