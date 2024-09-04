import Player from "@/models/player.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const saveImage = async (file, firstName, lastName, jerseyNumber) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${firstName}-${lastName}-${jerseyNumber}.${
    file.type.split("/")[1]
  }`;
  const relativePath = `/images/players/${fileName}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.writeFile(absolutePath, buffer);

  return relativePath;
};

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();

    let imagePath = "/images/players/player-default.jpg";
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File) {
      imagePath = await saveImage(
        imageFile,
        formData.get("firstName"),
        formData.get("lastName"),
        formData.get("jerseyNumber")
      );
    }

    const playerData = {
      image: imagePath,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      DOB: formData.get("DOB"),
      height: formData.get("height"),
      position: formData.get("position"),
      jerseyNumber: formData.get("jerseyNumber"),
      nationality: formData.get("nationality"),
      bio: formData.get("bio"),
      featured: formData.get("featured"),
      marquee: formData.get("marquee"),
    };

    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();

    return NextResponse.json(
      {
        success: true,
        data: savedPlayer,
        message: "Player saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
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
    const players = await Player.find();
    return NextResponse.json({ success: true, data: players });
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
