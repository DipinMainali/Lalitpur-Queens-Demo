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

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const contact = await Player.findOneAndDelete({ _id: params.id });

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

//patch request -editing existing player

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

export async function PATCH(req, { params }) {
  await dbConnection();

  const { id } = params;

  try {
    const formData = await req.formData();

    let player = await Player.findById(id);
    if (!player) {
      return NextResponse.json(
        {
          success: false,
          message: "Player not found",
        },
        { status: 404 }
      );
    }

    const imageFile = formData.get("image");
    let imagePath = player.image;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveImage(
        imageFile,
        formData.get("firstName"),
        formData.get("lastName"),
        formData.get("jerseyNumber")
      );
    }

    player.image = imagePath;
    player.firstName = formData.get("firstName") || player.firstName;
    player.lastName = formData.get("lastName") || player.lastName;
    player.DOB = formData.get("DOB") || player.DOB;
    player.height = formData.get("height") || player.height;
    player.position = formData.get("position") || player.position;
    player.jerseyNumber = formData.get("jerseyNumber") || player.jerseyNumber;
    player.nationality = formData.get("nationality") || player.nationality;
    player.bio = formData.get("bio") || player.bio;
    player.featured = formData.get("featured") || player.featured;

    const updatedPlayer = await player.save();

    return NextResponse.json(
      {
        success: true,
        data: updatedPlayer,
        message: "Player updated successfully",
      },
      { status: 200 }
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

//get specific player filtered from id
export async function GET(_req, { params }) {
  await dbConnection();

  try {
    const player = await Player.findOne({ _id: params.id });

    return NextResponse.json({ success: true, data: player });
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
