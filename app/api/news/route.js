import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // Parse the request body
    const newNews = new News(body);
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
