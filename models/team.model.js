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
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default Team;
