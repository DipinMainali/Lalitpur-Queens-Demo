import { NextResponse } from "next/server";
import dbConnection from "@/utils/dbconnection";
import Season from "@/models/season.model";
import mongoose from "mongoose";

// GET handler to fetch a single season by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid season ID format" },
        { status: 400 }
      );
    }

    await dbConnection();

    const season = await Season.findById(id);

    if (!season) {
      return NextResponse.json(
        { success: false, message: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: season,
    });
  } catch (error) {
    console.error("Error fetching season:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch season" },
      { status: 500 }
    );
  }
}

// PUT handler to update a season by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, year, startDate, endDate, isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid season ID format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !year) {
      return NextResponse.json(
        { success: false, message: "Season name and year are required" },
        { status: 400 }
      );
    }

    await dbConnection();

    // If this season is being set as active, deactivate all others
    if (isActive) {
      await Season.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updateData = {
      name,
      year,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive || false,
    };

    const updatedSeason = await Season.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeason) {
      return NextResponse.json(
        { success: false, message: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSeason,
      message: "Season updated successfully",
    });
  } catch (error) {
    console.error("Error updating season:", error);

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
      { success: false, message: error.message || "Failed to update season" },
      { status: 500 }
    );
  }
}

// PATCH handler for partial updates (used for toggling active status)
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid season ID format" },
        { status: 400 }
      );
    }

    await dbConnection();

    // If setting as active, deactivate all others
    if (body.isActive === true) {
      await Season.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updatedSeason = await Season.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedSeason) {
      return NextResponse.json(
        { success: false, message: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSeason,
      message: "Season updated successfully",
    });
  } catch (error) {
    console.error("Error updating season:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update season" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a season by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid season ID format" },
        { status: 400 }
      );
    }

    await dbConnection();

    const deletedSeason = await Season.findByIdAndDelete(id);

    if (!deletedSeason) {
      return NextResponse.json(
        { success: false, message: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Season deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting season:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete season" },
      { status: 500 }
    );
  }
}
