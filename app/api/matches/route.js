import Match from "@/models/match.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // Parse the request body
    const newMatch = new Match(body);
    const savedMatch = await newMatch.save();

    return NextResponse.json(
      {
        success: true,
        data: savedMatch,
        message: "Match saved successfully",
      },
      { status: 200 }
    ); // Set the status code here
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

export async function GET() {
  await dbConnection();

  try {
    const matchs = await Match.find();
    return NextResponse.json({ success: true, data: matchs });
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
