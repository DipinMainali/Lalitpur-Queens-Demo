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

//get standing by unique id
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

    const standing = await Standing.findById(id);

    if (!standing) {
      return NextResponse.json(
        { success: false, message: "Standing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: standing });
  } catch (error) {
    console.error("Error fetching standing:", error); // Log the error
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
