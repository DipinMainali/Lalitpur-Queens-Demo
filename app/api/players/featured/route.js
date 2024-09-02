import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnection();

  try {
    const players = await Player.find({ featured: true });

    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: error.status || 500 }
    );
  }
}
