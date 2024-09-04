import Sponser from "@/models/sponser.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const saveImage = async (file, sponsorName) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${sponsorName}.${file.type.split("/")[1]}`;
  const relativePath = `/images/sponsors/${fileName}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.writeFile(absolutePath, buffer);

  return relativePath;
};

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData(); // Parse the request body from form data
    let imagePath = "/images/sponsors/sponsor-default.jpg";
    const imageFile = formData.get("logo");
    if (imageFile && imageFile instanceof File) {
      imagePath = await saveImage(imageFile, formData.get("name"));
    }
    const sponsorData = {
      name: formData.get("name"),
      logo: imagePath,
      website: formData.get("website"),
      tier: formData.get("tier"),
    };

    const newSponser = new Sponser(sponsorData);
    const savedSponser = await newSponser.save();

    return NextResponse.json(
      {
        success: true,
        data: savedSponser,
        message: "Sponser saved successfully",
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
