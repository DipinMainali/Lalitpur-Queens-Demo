import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const news = await News.findOneAndDelete({ _id: params.id });

    if (!news) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
      message: "Article deleted successfully",
    });
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

// Update existing news article
export async function PATCH(req, { params }) {
  await dbConnection();
  const { id } = params;

  try {
    // Get the existing news article
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    // Check content type to determine if it's JSON or FormData
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Handle JSON data for simple updates like status changes
      const jsonData = await req.json();

      // Update fields that are present in the request
      if (jsonData.status) news.status = jsonData.status;
      if (jsonData.title) news.title = jsonData.title;
      if (jsonData.content) news.content = jsonData.content;
      if (jsonData.tags) {
        news.tags = jsonData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const updatedNews = await news.save();

      return NextResponse.json(
        {
          success: true,
          data: updatedNews,
          message: "Article updated successfully",
        },
        { status: 200 }
      );
    } else {
      // Handle FormData (original implementation for form submissions with files)
      const formData = await req.formData();

      // Extract form data
      const title = formData.get("title") || news.title;
      const content = formData.get("content") || news.content;
      const tags = formData.get("tags");
      const status = formData.get("status") || news.status;
      const imageFile = formData.get("image");

      // Process tags
      let tagArray = news.tags || [];
      if (tags && typeof tags === "string") {
        tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      // Handle image update if a new file is provided
      let imagePath = news.image;
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
            {
              success: false,
              message: "Error configuring image upload service",
            },
            { status: 500 }
          );
        }

        try {
          // Prepare file for upload
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
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

      // Update news article
      news.title = title;
      news.content = content;
      news.image = imagePath;
      news.tags = tagArray;
      news.status = status;

      const updatedNews = await news.save();

      return NextResponse.json(
        {
          success: true,
          data: updatedNews,
          message: "Article updated successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: error.status || 500 }
    );
  }
}

// Handle PUT method for the NewsForm component
export async function PUT(req, { params }) {
  return PATCH(req, { params });
}

// Get specific news article by ID
export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const news = await News.findOne({ _id: params.id });

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

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
