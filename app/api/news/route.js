import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveNewsImage = async (file, newsTitle) => {
  // Convert the file to a buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a sanitized filename using the news title
  const sanitizedTitle = newsTitle.replace(/\s+/g, "-").toLowerCase();
  const fileName = `${sanitizedTitle}.${file.type.split("/")[1]}`;

  // Define the relative and absolute paths
  const relativePath = `/images/news/${fileName}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  // Write the file to the specified path
  await fs.writeFile(absolutePath, buffer);

  // Return the relative path for storage in the database
  return relativePath;
};

export { saveNewsImage };

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData(); // Parse the request body from form data

    let imagePath = "/images/news/news-default.jpg";
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File) {
      imagePath = await saveNewsImage(imageFile, formData.get("title"));
    }

    const newsData = {
      title: formData.get("title"),
      image: imagePath,
      content: formData.get("content"),
    };

    const newNews = new News(newsData);
    const savedNews = await newNews.save();

    return NextResponse.json(
      {
        success: true,
        data: savedNews,
        message: "News saved successfully",
      },
      { status: 200 }
    ); // Set the status code here
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

export async function GET() {
  await dbConnection();

  try {
    const newss = await News.find();
    return NextResponse.json({ success: true, data: newss });
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
