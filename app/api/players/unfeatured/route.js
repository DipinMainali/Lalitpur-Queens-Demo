// /app/api/players/unfeature/route.js

import { NextResponse } from "next/server";
import Player from "@/models/player.model";

export async function PUT() {
  try {
    // Update all players to set `featured` to false
    await Player.updateMany({}, { featured: false });
    return NextResponse.json({
      success: true,
      message: "All players unfeatured successfully",
    });
  } catch (error) {
    console.error("Error unfeaturing players:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unfeature players" },
      { status: 500 }
    );
  }
}
