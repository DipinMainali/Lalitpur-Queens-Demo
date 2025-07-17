import mongoose from "mongoose";
import { teamSchema } from "@/models/team.model.js";

const standingSchema = new mongoose.Schema(
  {
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a team has only one standing per season
standingSchema.index({ season: 1, "team._id": 1 }, { unique: true });

const Standing =
  mongoose.models.Standing || mongoose.model("Standing", standingSchema);

export default Standing;
