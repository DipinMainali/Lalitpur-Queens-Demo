import Match from "@/models/match.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { recalculateStandings } from "@/utils/standingsCalculator";

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const match = await Match.findById(params.id);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    // Check if this was a completed match
    const wasCompleted = match.matchStatus === "Completed";

    // Delete the match
    await Match.findOneAndDelete({ _id: params.id });

    // If this was a completed match, recalculate standings
    if (wasCompleted) {
      await recalculateStandings();
    }

    return NextResponse.json({ success: true, data: match });
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

//patch request -editing existing match
export async function PATCH(req, { params }) {
  await dbConnection();

  try {
    const body = await req.json();

    // Get current match to check if status is changing
    const currentMatch = await Match.findById(params.id);
    if (!currentMatch) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    // Update match
    const match = await Match.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });

    // Check if match status has changed to/from "Completed"
    const statusChanged = currentMatch.matchStatus !== match.matchStatus;
    const isNowCompleted = match.matchStatus === "Completed";
    const wasCompleted = currentMatch.matchStatus === "Completed";

    // If match status has changed to or from "Completed", or scores were updated
    // for a completed match, recalculate standings
    if (statusChanged || (isNowCompleted && body.scores)) {
      await recalculateStandings();
    }

    return NextResponse.json({ success: true, data: match });
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

//get match by unique id
export async function GET(request, { params }) {
  await dbConnection();

  try {
    const { id } = params; // Extract ID from params
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const match = await Match.findById(id);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: match });
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
