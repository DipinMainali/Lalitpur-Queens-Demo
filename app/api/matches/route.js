import Match from "@/models/match.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.tournament) {
      return NextResponse.json(
        { success: false, message: "Tournament is required" },
        { status: 400 }
      );
    }

    if (!body.matchDateTime) {
      return NextResponse.json(
        { success: false, message: "Match date and time are required" },
        { status: 400 }
      );
    }

    if (!body.homeTeam || !body.awayTeam) {
      return NextResponse.json(
        { success: false, message: "Both teams are required" },
        { status: 400 }
      );
    }

    if (!body.matchStatus) {
      return NextResponse.json(
        { success: false, message: "Match status is required" },
        { status: 400 }
      );
    }

    // Validate season is provided
    if (!body.season) {
      return NextResponse.json(
        { success: false, message: "Season is required" },
        { status: 400 }
      );
    }

    // Create new match
    const match = await Match.create(body);

    return NextResponse.json({
      success: true,
      data: match,
      message: "Match created successfully",
    });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create match",
      },
      { status: error.status || 500 }
    );
  }
}

export async function GET(req) {
  await dbConnection();

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || null;
    const seasonId = url.searchParams.get("season") || null;

    let query = {};

    // Filter by status if provided
    if (status) {
      query.matchStatus = status;
    }

    // Filter by season if provided
    if (seasonId) {
      query.season = seasonId;
    }

    // Get all matches, sort by date (most recent first)
    const matches = await Match.find(query)
      .sort({ matchDateTime: -1 })
      .populate({
        path: "season",
        model: "Season",
        select: "name year isActive",
        strictPopulate: false, // Add this option
      });

    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch matches",
      },
      { status: error.status || 500 }
    );
  }
}
