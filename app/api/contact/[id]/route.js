import Contact from "@/models/contact.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Contact.findById(params.id);

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
