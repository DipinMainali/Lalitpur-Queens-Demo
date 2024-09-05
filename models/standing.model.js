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
    default: 0,
  },
  won: {
    type: Number,
    required: true,
    default: 0,
  },
  drawn: {
    type: Number,
    required: true,
    default: 0,
  },
  lost: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  setWon: {
    type: Number,
    required: true,
    default: 0,
  },
  setLost: {
    type: Number,
    required: true,
    default: 0,
  },
});
const Standing =
  mongoose.models.Standing || mongoose.model("Standing", standingSchema);
export default Standing;
