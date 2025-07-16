import { NextResponse } from "next/server";
import dbConnection from "@/utils/dbconnection";
import Team from "@/models/team.model";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnection();

    // Parse the form data
    const data = await request.formData();
    const name = data.get("name");
    const logoFile = data.get("logo");

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      );
    }

    if (!logoFile) {
      return NextResponse.json(
        { success: false, message: "Team logo is required" },
        { status: 400 }
      );
    }

    // Log Cloudinary configuration (remove in production)
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "set" : "not set",
      api_key: process.env.CLOUDINARY_API_KEY ? "set" : "not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "not set",
    });

    // Configure Cloudinary with error handling
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    } catch (cloudinaryConfigError) {
      console.error("Cloudinary config error:", cloudinaryConfigError);
      return NextResponse.json(
        { success: false, message: "Error configuring image upload service" },
        { status: 500 }
      );
    }

    // Upload logo to Cloudinary
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename based on team name and timestamp
    const timestamp = new Date().getTime();
    const filename = `${name
      .replace(/\s+/g, "-")
      .toLowerCase()}-logo-${timestamp}`;

    try {
      // Use this approach instead of signed uploads
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: "lalitpurqueens", // Replace with your preset name
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      // Create team with Cloudinary URL
      const team = new Team({
        name: name,
        logo: uploadResult.secure_url,
      });

      await team.save();

      return NextResponse.json({
        success: true,
        message: "Team created successfully",
        data: team,
      });
    } catch (uploadError) {
      console.error("Upload error details:", uploadError);
      return NextResponse.json(
        {
          success: false,
          message: `Image upload failed: ${uploadError.message}`,
          error: uploadError,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create team" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnection(); // Changed from dbConnection()

  try {
    const teams = await Team.find();
    return NextResponse.json({ success: true, data: teams });
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
