import { NextResponse } from "next/server";
import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes (increased to match sponsor file size)

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();

    // Extract player data from form
    const playerData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      DOB: formData.get("DOB"),
      height: formData.get("height"),
      position: formData.get("position"),
      jerseyNumber: formData.get("jerseyNumber"),
      nationality: formData.get("nationality"),
      bio: formData.get("bio") || "",
      featured: formData.get("featured") === "true",
      marquee: formData.get("marquee") === "true",
    };

    // Parse seasons array from JSON string
    const seasonsString = formData.get("seasons");
    let seasons = [];

    try {
      if (seasonsString) {
        seasons = JSON.parse(seasonsString);
      }
    } catch (e) {
      console.error("Error parsing seasons:", e);
      return NextResponse.json(
        { success: false, message: "Invalid seasons format" },
        { status: 400 }
      );
    }

    // Validate that at least one season is selected
    if (!seasons || seasons.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one season must be selected" },
        { status: 400 }
      );
    }

    // Default image path if no image provided
    let imagePath = "/images/players/player-default.jpg";
    const imageFile = formData.get("image");

    // Handle image upload if file is provided
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      // Check file size
      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Image size must be less than 10MB" },
          { status: 400 }
        );
      }

      // Configure Cloudinary
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

      try {
        // Prepare file for upload
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = new Date().getTime();
        const filename = `${playerData.firstName}-${playerData.lastName}-${playerData.jerseyNumber}-${timestamp}`;

        // Upload to Cloudinary using upload preset
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: "lalitpurqueens",
              folder: "players",
              public_id: filename,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        // IMPORTANT: Only update the imagePath if upload succeeds
        imagePath = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Upload error details:", uploadError);
        return NextResponse.json(
          {
            success: false,
            message: `Image upload failed: ${uploadError.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Add the image URL to player data
    playerData.image = imagePath;
    playerData.seasons = seasons; // Add seasons to player data

    // Create and save the new player
    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();

    return NextResponse.json(
      {
        success: true,
        data: savedPlayer,
        message: "Player saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: error.status || 500 }
    );
  }
}

export async function GET(req) {
  await dbConnection();

  try {
    const url = new URL(req.url);
    const seasonId = url.searchParams.get("seasonId");

    // If seasonId is provided, filter players by season
    let players;
    if (seasonId) {
      players = await Player.find({ seasons: { $in: [seasonId] } });
    } else {
      players = await Player.find();
    }

    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch players",
      },
      { status: 500 }
    );
  }
}
