import mongoose from "mongoose";
const sponserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String, // URL to the sponsor's logo image
    required: true,
  },
  website: {
    type: String, // URL to the sponsor's website
    required: true,
  },
  tier: {
    type: String,
    required: true,
  },
});
const Sponser =
  mongoose.models.Sponser || mongoose.model("Sponser", sponserSchema);
export default Sponser;
