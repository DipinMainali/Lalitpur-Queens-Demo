import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
  //Reference to the season model so that each team is associated with a specific season
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
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
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export { teamSchema };
export default Team;
