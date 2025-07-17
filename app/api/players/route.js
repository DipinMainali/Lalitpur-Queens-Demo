import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
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
      bio: formData.get("bio"),
      featured: formData.get("featured") === "true",
      marquee: formData.get("marquee") === "true",
    };

    // Validate required fields
    if (!playerData.firstName || !playerData.lastName) {
      return NextResponse.json(
        { success: false, message: "First name and last name are required" },
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

export async function GET() {
  await dbConnection();

  try {
    const players = await Player.find();
    return NextResponse.json({ success: true, data: players });
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
