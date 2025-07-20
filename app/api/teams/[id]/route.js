import Team from "@/models/team.model";
import Season from "@/models/season.model"; // Added missing import
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary"; // Import cloudinary if you're using it

// Function to save team logo - updated to use Cloudinary
const saveTeamLogo = async (file, teamName) => {
  try {
    // Configure Cloudinary (ensure you have environment variables set)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const sanitizedTeamName = teamName
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const filename = `${sanitizedTeamName}-logo-${timestamp}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "lalitpurqueens", // Your preset name
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error uploading logo:", error);
    throw new Error(`Failed to upload logo: ${error.message}`);
  }
};

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const team = await Team.findOneAndDelete({ _id: params.id });

    return NextResponse.json({ success: true, data: team });
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

// Get a single team by ID
export async function GET(request, { params }) {
  await dbConnection();

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // Populate the season data when fetching a team
    const team = await Team.findById(id).populate("season");

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a team
export async function PATCH(req, { params }) {
  await dbConnection();

  try {
    const formData = await req.formData();

    // Basic validation
    const name = formData.get("name");
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      );
    }

    const updateData = {
      name: name.trim(),
    };

    // Add season to update data if provided
    const seasonId = formData.get("season");
    if (seasonId) {
      // Check if season exists
      const seasonExists = await Season.findById(seasonId);
      if (!seasonExists) {
        return NextResponse.json(
          { success: false, message: "Selected season does not exist" },
          { status: 400 }
        );
      }
      updateData.season = seasonId;
    }

    // Handle logo update if a new file is provided
    const logoFile = formData.get("logo");
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      try {
        const logoUrl = await saveTeamLogo(logoFile, name);
        updateData.logo = logoUrl;
      } catch (logoError) {
        console.error("Logo upload error:", logoError);
        return NextResponse.json(
          {
            success: false,
            message: `Error uploading logo: ${logoError.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Find and update the team
    const team = await Team.findOneAndUpdate({ _id: params.id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
