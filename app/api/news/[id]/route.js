import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import { saveNewsImage } from "../route";

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await News.findOneAndDelete({ _id: params.id });

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

//patch request -editing existing news
export async function PATCH(req, { params }) {
  await dbConnection();
  const { id } = params;

  try {
    const formData = await req.formData(); // Parse the request body from form data

    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    const imageFile = formData.get("image");
    let imagePath = news.image;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveNewsImage(imageFile, formData.get("title"));
    }
    news.image = imagePath;
    news.title = formData.get("title");
    news.content = formData.get("content");

    const savedNews = await news.save();

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

//get specific news filtered from id
export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const news = await News.findOne({ _id: params.id });

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
