import Standing from "@/models/standing.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

// Get a specific standing by ID
export async function GET(req, { params }) {
  await dbConnection();
  const { id } = params;

  try {
    const standing = await Standing.findById(id);

    if (!standing) {
      return NextResponse.json(
        { success: false, message: "Standing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: standing });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Update a standing by ID
export async function PATCH(req, { params }) {
  await dbConnection();
  const { id } = params;
  const body = await req.json();

  try {
    const updatedStanding = await Standing.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedStanding) {
      return NextResponse.json(
        { success: false, message: "Standing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStanding,
      message: "Standing updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Delete a standing by ID
export async function DELETE(req, { params }) {
  await dbConnection();
  const { id } = params;

  try {
    const deletedStanding = await Standing.findByIdAndDelete(id);

    if (!deletedStanding) {
      return NextResponse.json(
        { success: false, message: "Standing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Standing deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
