import Sponser from "@/models/sponser.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const sponsor = await Sponser.findById(params.id);

    if (!sponsor) {
      return NextResponse.json(
        {
          success: false,
          message: "Sponsor not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sponsor });
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

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Sponser.findOneAndDelete({ _id: params.id });

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
