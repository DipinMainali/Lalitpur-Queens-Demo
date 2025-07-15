import { NextResponse } from "next/server";
import dbConnection from "@/utils/dbconnection";
import { recalculateStandings } from "@/utils/standingsCalculator";

export async function POST() {
  await dbConnection();

  try {
    await recalculateStandings();

    return NextResponse.json({
      success: true,
      message: "Standings recalculated successfully",
    });
  } catch (error) {
    console.error("Error recalculating standings:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to recalculate standings",
      },
      { status: 500 }
    );
  }
}
