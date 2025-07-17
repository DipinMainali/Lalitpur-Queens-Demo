import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Default image path
    let imagePath =
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1/players/player-default.jpg";

    // Handle image upload to Cloudinary
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        // Prepare file for upload
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const firstName = formData.get("firstName") || "";
        const lastName = formData.get("lastName") || "";
        const jerseyNumber = formData.get("jerseyNumber") || "";
        const timestamp = new Date().getTime();

        const filename = `${firstName}-${lastName}-${jerseyNumber}-${timestamp}`;

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

    const playerData = {
      image: imagePath,
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
