import Standing from "@/models/standing.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Standing.findOneAndDelete({ _id: params.id });

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

//patch request -editing existing standing
export async function PATCH(req, { params }) {
  await dbConnection();

  try {
    const body = await req.json();

    const standing = await Standing.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });

    return NextResponse.json({ success: true, data: standing });
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
