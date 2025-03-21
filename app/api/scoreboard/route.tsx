/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET endpoint: Fetch scoreboard data
export async function GET() {
  try {
    // Fetch scoreboard data where `id` is 1
    const scoreboard = await prisma.scoreboard.findUnique({
      where: { id: process.env.NODE_ENV === "development" ? 2 : 1 },
    });

    console.log({ sbres: scoreboard });

    // Handle the case where no data is found
    if (!scoreboard) {
      return NextResponse.json(
        { message: "Scoreboard not found" },
        { status: 404 }
      );
    }

    // Return the scoreboard data as JSON
    return NextResponse.json({ data: scoreboard }, { status: 200 });
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}

// PUT endpoint: Update scoreboard data
export async function PUT(request: Request) {
  try {
    // Parse the request body

    console.log({ request });
    const {
      team1_score,
      team2_score,
      team1_color,
      team2_color,
      timer,
      team1_name,
      team2_name,
      period,
      resetcount,
      team1_fouls,
      team2_fouls,
    } = await request.json();

    // Validate the input
    if (
      typeof team1_score !== "number" ||
      typeof team2_score !== "number" ||
      typeof timer !== "number" ||
      !/^#[0-9A-Fa-f]{6}$/.test(team1_color) ||
      !/^#[0-9A-Fa-f]{6}$/.test(team2_color)
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Update the scoreboard
    const updatedScoreboard = await prisma.scoreboard.update({
      where: { id: process.env.NODE_ENV === "development" ? 2 : 1 },
      data: {
        team1_score,
        team2_score,
        team1_color,
        team2_color,
        timer,
        team1_name,
        team2_name,
        period,
        resetcount,
        team1_fouls,
        team2_fouls,
      },
    });

    if (updatedScoreboard) {
      console.log({ updatedScoreboard });
    }

    return NextResponse.json({}, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    // console.log("Error updating scoreboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}
