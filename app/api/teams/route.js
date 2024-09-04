import Team from "@/models/team.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
const saveTeamLogo = async (file, teamName) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a sanitized version of the team name to avoid issues with special characters
  const sanitizedTeamName = teamName.replace(/[^a-zA-Z0-9]/g, "-");
  const fileName = `${sanitizedTeamName}-logo.${file.type.split("/")[1]}`;
  const relativePath = `/images/teams/${fileName}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.writeFile(absolutePath, buffer);

  return relativePath;
};

export async function POST(req) {
  await dbConnection();

  try {
    const formData = await req.formData();

    let imagePath = "/images/teams/team-default.jpg";
    const imageFile = formData.get("logo");
    if (imageFile && imageFile instanceof File) {
      imagePath = await saveTeamLogo(imageFile, formData.get("name"));
    }

    const teamData = {
      logo: imagePath,
      name: formData.get("name"),
    };

    const newTeam = new Team(teamData);
    const savedTeam = await newTeam.save();
    return NextResponse.json(
      {
        success: true,
        data: savedTeam,
        message: "Team saved successfully",
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
    const teams = await Team.find();
    return NextResponse.json({ success: true, data: teams });
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
