//create mongoose schema for volleyball player
import mongoose from "mongoose";
const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  height: {
    type: Number, // Height in centimeters
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  jerseyNumber: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  // Add seasons array to associate player with multiple seasons
  seasons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },
  ],
});
const Player = mongoose.models.Player || mongoose.model("Player", playerSchema);
export default Player;
