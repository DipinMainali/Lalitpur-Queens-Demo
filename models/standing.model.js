import mongoose from "mongoose";
import { teamSchema } from "@/models/team.model.js";
const standingSchema = new mongoose.Schema({
  team: {
    type: teamSchema,
    required: true,
  },
  played: {
    //positive type number
    type: Number,
    required: true,
  },
  won: {
    type: Number,
    required: true,
  },
  drawn: {
    type: Number,
    required: true,
  },
  lost: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  setWon: {
    type: Number,
    required: true,
  },
  setLost: {
    type: Number,
    required: true,
  },
});
const Standing =
  mongoose.models.Standing || mongoose.model("Standing", standingSchema);
export default Standing;
