import Sponser from "@/models/sponser.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const sponsor = await Sponser.findById(params.id);

    if (!sponsor) {
      return NextResponse.json(
        {
          success: false,
          message: "Sponsor not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sponsor });
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

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Sponser.findOneAndDelete({ _id: params.id });

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

// Update a sponsor
export async function PATCH(req, { params }) {
  await dbConnection();

  try {
    const formData = await req.formData();

    const updateData = {
      name: formData.get("name"),
      website: formData.get("website"),
      tier: formData.get("tier"),
    };

    // Handle logo update if a new file is provided
    const logoFile = formData.get("logo");
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      // Check file size
      if (logoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Logo size must be less than 1MB" },
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
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename for reference (used in upload options)
        const name = formData.get("name");
        const timestamp = new Date().getTime();
        const publicId = `sponsors/${name
          .replace(/\s+/g, "-")
          .toLowerCase()}-logo-${timestamp}`;

        // Upload to Cloudinary using upload preset
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: "lalitpurqueens",
              folder: "sponsors",
              public_id: publicId.split("/")[1], // Use the filename portion without folder
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        updateData.logo = uploadResult.secure_url;
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

    const sponsor = await Sponser.findOneAndUpdate(
      { _id: params.id },
      updateData,
      {
        new: true,
      }
    );

    if (!sponsor) {
      return NextResponse.json(
        { success: false, message: "Sponsor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sponsor });
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
