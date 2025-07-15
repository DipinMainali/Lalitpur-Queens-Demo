import Team from "@/models/team.model";
import dbConnection from "@/utils/dbconnection";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(_req, { params }) {
  await dbConnection();

  try {
    const team = await Team.findOneAndDelete({ _id: params.id });

    return NextResponse.json({ success: true, data: team });
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

// Function to save team logo
const saveTeamLogo = async (file, teamName) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a sanitized version of the team name to avoid issues with special characters
  const sanitizedTeamName = teamName.replace(/[^a-zA-Z0-9]/g, "-");
  const fileName = `${sanitizedTeamName}-logo-${Date.now()}.${
    file.type.split("/")[1]
  }`;
  const relativePath = `/images/teams/${fileName}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.writeFile(absolutePath, buffer);

  return relativePath;
};

// Get a single team by ID
export async function GET(request, { params }) {
  await dbConnection();

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a team
export async function PATCH(req, { params }) {
  await dbConnection();

  try {
    const formData = await req.formData();

    const updateData = {
      name: formData.get("name"),
    };

    // Handle logo update if a new file is provided
    const logoFile = formData.get("logo");
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      const imagePath = await saveTeamLogo(logoFile, formData.get("name"));
      updateData.logo = imagePath;
    }

    const team = await Team.findOneAndUpdate({ _id: params.id }, updateData, {
      new: true,
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: team });
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
