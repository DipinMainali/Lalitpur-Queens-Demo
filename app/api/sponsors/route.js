import Sponser from "@/models/sponser.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // Parse the request body
    const newSponser = new Sponser(body);
    const savedSponser = await newSponser.save();

    return NextResponse.json(
      {
        success: true,
        data: savedSponser,
        message: "Sponser saved successfully",
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
    const sponsers = await Sponser.find();
    return NextResponse.json({ success: true, data: sponsers });
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
