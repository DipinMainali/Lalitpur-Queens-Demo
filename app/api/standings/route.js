import Standing from "@/models/standing.model";
import Team from "@/models/team.model";
import Season from "@/models/season.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.team || !body.season) {
      return NextResponse.json(
        { success: false, message: "Team and season are required" },
        { status: 400 }
      );
    }

    // Check if standing already exists for this team and season
    const existingStanding = await Standing.findOne({
      "team._id": body.team._id,
      season: body.season,
    });

    if (existingStanding) {
      return NextResponse.json(
        {
          success: false,
          message: "Standing for this team and season already exists",
        },
        { status: 400 }
      );
    }

    // Create a new standing with all manually entered values
    const newStanding = new Standing({
      team: body.team,
      season: body.season,
      played: body.played || 0,
      won: body.won || 0,
      drawn: body.drawn || 0,
      lost: body.lost || 0,
      points: body.points || 0,
      setWon: body.setWon || 0,
      setLost: body.setLost || 0,
    });

    const savedStanding = await newStanding.save();

    return NextResponse.json(
      {
        success: true,
        data: savedStanding,
        message: "Standing created successfully",
      },
      { status: 201 }
    );
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

export async function GET(req) {
  await dbConnection();
  const url = new URL(req.url);
  const seasonId = url.searchParams.get("seasonId");

  try {
    // Get active season if no seasonId is provided
    let selectedSeasonId = seasonId;
    if (!selectedSeasonId) {
      const activeSeason = await Season.findOne({ isActive: true });
      selectedSeasonId = activeSeason?._id;

      // If no active season, get the most recent one
      if (!selectedSeasonId) {
        const latestSeason = await Season.findOne().sort({ year: -1 });
        selectedSeasonId = latestSeason?._id;
      }
    }

    // Fetch standings for the selected season
    const standings = selectedSeasonId
      ? await Standing.find({ season: selectedSeasonId }).populate("season")
      : [];

    // Get all available seasons for the dropdown
    const seasons = await Season.find().sort({ year: -1 });

    // Get teams that don't have standings in this season yet
    const teamsWithStandings = new Set(
      standings.map((s) => s.team._id.toString())
    );
    const teams = await Team.find({
      _id: { $nin: Array.from(teamsWithStandings) },
    });

    return NextResponse.json({
      success: true,
      data: standings,
      availableTeams: teams,
      seasons: seasons,
      currentSeason: selectedSeasonId,
    });
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
