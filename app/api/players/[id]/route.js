import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const player = await Player.findOneAndDelete({ _id: params.id });

    return NextResponse.json({ success: true, data: player });
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

//patch request -editing existing player
export async function PATCH(req, { params }) {
  await dbConnection();

  const { id } = params;

  try {
    const formData = await req.formData();

    let player = await Player.findById(id);
    if (!player) {
      return NextResponse.json(
        {
          success: false,
          message: "Player not found",
        },
        { status: 404 }
      );
    }

    // Handle image upload to Cloudinary
    const imageFile = formData.get("image");
    let imagePath = player.image;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      // Check file size
      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Image size must be less than 1MB" },
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
        const firstName = formData.get("firstName") || player.firstName;
        const lastName = formData.get("lastName") || player.lastName;
        const jerseyNumber =
          formData.get("jerseyNumber") || player.jerseyNumber;
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

    // Update player fields
    player.image = imagePath;
    player.firstName = formData.get("firstName") || player.firstName;
    player.lastName = formData.get("lastName") || player.lastName;
    player.DOB = formData.get("DOB") || player.DOB;
    player.height = formData.get("height") || player.height;
    player.position = formData.get("position") || player.position;
    player.jerseyNumber = formData.get("jerseyNumber") || player.jerseyNumber;
    player.nationality = formData.get("nationality") || player.nationality;
    player.bio = formData.get("bio") || player.bio;
    player.featured = formData.get("featured") === "true" || player.featured;
    player.marquee = formData.get("marquee") === "true" || player.marquee;

    const updatedPlayer = await player.save();

    return NextResponse.json(
      {
        success: true,
        data: updatedPlayer,
        message: "Player updated successfully",
      },
      { status: 200 }
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

//get specific player filtered from id
export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const player = await Player.findOne({ _id: params.id });

    if (!player) {
      return NextResponse.json(
        {
          success: false,
          message: "Player not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: player });
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
