import Sponser from "@/models/sponser.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes (increased from 1MB)

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const logoFile = formData.get("logo");
    const website = formData.get("website");
    const tier = formData.get("tier");

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Sponsor name is required" },
        { status: 400 }
      );
    }

    // Check file size if logo is provided
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      if (logoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Logo size must be less than 10MB" },
          { status: 400 }
        );
      }
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

    // Default image path if no logo provided
    let logoUrl = "https://via.placeholder.com/300x200?text=Sponsor";

    // If logo file exists, upload to Cloudinary
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      try {
        // Prepare file for upload
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = new Date().getTime();
        const filename = `${name
          .replace(/\s+/g, "-")
          .toLowerCase()}-logo-${timestamp}`;

        // Upload to Cloudinary using upload preset
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: "lalitpurqueens",
              folder: "sponsors",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(buffer);
        });

        logoUrl = uploadResult.secure_url;
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
    }

    // Create sponsor with Cloudinary URL
    const sponsorData = {
      name,
      logo: logoUrl,
      website,
      tier,
    };

    const newSponser = new Sponser(sponsorData);
    const savedSponser = await newSponser.save();

    return NextResponse.json(
      {
        success: true,
        data: savedSponser,
        message: "Sponsor saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating sponsor:", error);
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
    const sponsers = await Sponser.find();
    return NextResponse.json({ success: true, data: sponsers });
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
