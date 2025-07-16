import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

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

    // Upload logo to Cloudinary
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename based on team name
    const filename = `${name.replace(/\s+/g, "-").toLowerCase()}-logo`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "teams",
          public_id: filename,
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
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create team" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnection();

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
