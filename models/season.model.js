import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index on name and year to ensure unique seasons
seasonSchema.index({ name: 1, year: 1 }, { unique: true });

const Season = mongoose.models.Season || mongoose.model("Season", seasonSchema);

export default Season;
