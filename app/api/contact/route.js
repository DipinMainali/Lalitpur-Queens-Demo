import Contact from "@/models/contact.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // Parse the request body
    const newContact = new Contact(body);
    const savedContact = await newContact.save();

    return NextResponse.json(
      {
        success: true,
        data: savedContact,
        message: "Contact saved successfully",
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
    const contacts = await Contact.find();
    return NextResponse.json({ success: true, data: contacts });
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
