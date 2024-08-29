import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

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

  try {
    const body = await req.json();

    if (body.title) {
      // Generate a new slug from the updated title
      let slug = body.title.toLowerCase().replace(/\s+/g, "-");

      // Check if the generated slug is unique
      let existingNews = await News.findOne({ slug });
      let count = 1;
      while (existingNews && existingNews._id.toString() !== params.id) {
        slug = `${body.title.toLowerCase().replace(/\s+/g, "-")}-${count++}`;
        existingNews = await News.findOne({ slug });
      }

      // Assign the unique slug to the body
      body.slug = slug;
    }

    const news = await News.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });

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
