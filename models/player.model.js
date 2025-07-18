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

  //featured player or not only one player can be featured
  featured: {
    type: Boolean,
    default: false,
  },
});
const Player = mongoose.models.Player || mongoose.model("Player", playerSchema);
export default Player;
