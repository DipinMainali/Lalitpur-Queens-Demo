import Season from "@/models/season.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

// GET handler to fetch all seasons
export async function GET(req) {
  await dbConnection();

  try {
    const url = new URL(req.url);
    const isActive = url.searchParams.get("active") === "true";

    let query = {};

    // If active param is provided, filter for active seasons
    if (isActive) {
      query.isActive = true;
    }

    // Get all seasons, sorted by year (descending) and then by name
    const seasons = await Season.find(query).sort({ year: -1, name: 1 });

    return NextResponse.json({ success: true, data: seasons });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch seasons",
      },
      { status: error.status || 500 }
    );
  }
}

// POST handler to create a new season
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, year, startDate, endDate, isActive } = body;

    // Validate required fields
    if (!name || !year) {
      return NextResponse.json(
        { success: false, message: "Season name and year are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnection();

    // If this season is being set as active, deactivate all others
    if (isActive) {
      await Season.updateMany({}, { isActive: false });
    }

    // Create the new season
    const newSeason = new Season({
      name,
      year,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive || false,
    });

    await newSeason.save();

    return NextResponse.json(
      {
        success: true,
        data: newSeason,
        message: "Season created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating season:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A season with this name and year already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Failed to create season" },
      { status: 500 }
    );
  }
}
