import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String, // URL to the sponsor's logo image
    required: true,
  },
});
const matchSchema = new mongoose.Schema({
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teamSchema",
    required: true,
  },
  venue: {
    type: String,
    default: "Dasarath Stadium",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    default: "not played",
  },
  status: {
    type: String,
    required: true,
  },
});

// pre saving logic

matchSchema.pre("save", function (next) {
  const match = this;
  if (match.status === "Completed" && !match.result) {
    return next(new Error("Match result is required"));
  }
  next();
});

const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);
export default Match;
