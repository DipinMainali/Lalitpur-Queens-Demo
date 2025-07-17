import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();

    // Extract data from form
    const title = formData.get("title");
    const content = formData.get("content");
    const tags = formData.get("tags") || "";
    const status = formData.get("status") || "published";
    const imageFile = formData.get("image");

    // Validation
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Article title is required" },
        { status: 400 }
      );
    }

    // Check file size if image is provided
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Image size must be less than 10MB" },
          { status: 400 }
        );
      }
    }

    // Default image path if no image provided
    let imagePath = "/images/news/news-default.jpg";

    // Handle image upload to Cloudinary if provided
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
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

        // Generate unique filename based on article title and timestamp
        const sanitizedTitle = title.replace(/\s+/g, "-").toLowerCase();
        const timestamp = new Date().getTime();
        const filename = `${sanitizedTitle}-${timestamp}`;

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: "lalitpurqueens",
              folder: "news",
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

    // Process tags
    let tagArray = [];
    if (tags && typeof tags === "string") {
      tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    // Create and save news article
    const newsData = {
      title,
      image: imagePath,
      content,
      tags: tagArray,
      status,
    };

    const newNews = new News(newsData);
    const savedNews = await newNews.save();

    return NextResponse.json(
      {
        success: true,
        data: savedNews,
        message: "Article saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
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
    // Get the URL from the request
    const { searchParams } = new URL(req.url);

    // Get status filter from query params (default to published)
    const status = searchParams.get("status") || "published";

    // Build query based on status parameter
    let query = {};

    // If status is 'all', don't filter by status (admin view)
    if (status !== "all") {
      query.status = status;
    }

    // Get articles with the specified status, sorted by creation date (newest first)
    const news = await News.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: news });
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
