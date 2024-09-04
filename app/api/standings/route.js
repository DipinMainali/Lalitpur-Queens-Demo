import Standing from "@/models/standing.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // Parse the request body
    const newStanding = new Standing(body);
    const savedStanding = await newStanding.save();

    return NextResponse.json(
      {
        success: true,
        data: savedStanding,
        message: "Standing saved successfully",
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
    const standings = await Standing.find();
    return NextResponse.json({ success: true, data: standings });
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
