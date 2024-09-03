import Match from "@/models/match.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Match.findOneAndDelete({ _id: params.id }, body, {
      new: true,
    });

    return NextResponse.json({ success: true, data: contact });
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

    const match = await Match.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });

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
