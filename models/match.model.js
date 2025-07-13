import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const scoreSchema = new mongoose.Schema({
  sets: [
    {
      homeScore: { type: Number, required: true },
      awayScore: { type: Number, required: true },
    },
  ],
  totalSets: {
    home: { type: Number, required: true },
    away: { type: Number, required: true },
  },
});

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
    },
    gameDay: {
      type: Number,
      required: true,
    },
    matchDateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    homeTeam: {
      type: teamSchema,
      required: true,
    },
    awayTeam: {
      type: teamSchema,
      required: true,
    },
    matchStatus: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"],
      default: "Scheduled",
      required: true,
    },
    scores: {
      type: scoreSchema,
      required: function () {
        return (
          this.matchStatus === "Completed" || this.matchStatus === "In Progress"
        );
      },
    },
    winnerTeam: {
      type: String,
      enum: ["home", "away", "draw"],
      required: function () {
        return this.matchStatus === "Completed";
      },
    },
  },
  { timestamps: true }
);

// Calculate winner team based on scores
matchSchema.pre("save", function (next) {
  const match = this;

  // If match is completed and has scores, determine winner
  if (match.matchStatus === "Completed" && match.scores) {
    if (match.scores.totalSets.home > match.scores.totalSets.away) {
      match.winnerTeam = "home";
    } else if (match.scores.totalSets.away > match.scores.totalSets.home) {
      match.winnerTeam = "away";
    } else {
      match.winnerTeam = "draw";
    }
  }

  next();
});

const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);
export default Match;
