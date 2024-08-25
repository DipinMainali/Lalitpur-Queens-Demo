"use server";
import dbConnection from "@/utils/dbconnection";
import Player from "@/models/player.model";

export async function createPlayer(formData) {
  try {
    await dbConnection();
    const player = new Player({
      firstName: formData.firstName,
      lastName: formData.lastName,
      DOB: formData.DOB,
      height: formData.height,
      position: formData.position,
      jerseyNumber: formData.jerseyNumber,
      nationality: formData.nationality,
      image: formData.image,
    });
    await player.save();
    console.log("Player created successfully");
  } catch (error) {
    console.log(error);
    console.log("Player creation failed");
  }
}

export async function getPlayers() {
  try {
    await dbConnection();
    // Get all players
    const players = await Player.find({});
    return players;
  } catch (error) {
    console.log(error);
    console.log("Failed to get players");
  }
}

export async function getPlayerById(id) {
  try {
    await dbConnection();
    // Get player by id
    const player = await Player.findById(id);
    return player;
  } catch (error) {
    console.log(error);
    console.log("Failed to get player");
  }
}

export async function updatePlayer(id, formData) {
  try {
    await dbConnection();
    // Update player by id
    const player = await Player.findByIdAndUpdate(id, formData, { new: true });
    return player;
  } catch (error) {
    console.log(error);
    console.log("Failed to update player");
  }
}

export async function deletePlayer(id) {
  try {
    await dbConnection();
    // Delete player by id
    const player = await Player.findByIdAndDelete(id);
    return player;
  } catch (error) {
    console.log(error);
    console.log("Failed to delete player");
  }
}
