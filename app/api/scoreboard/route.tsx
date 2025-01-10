/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../../../lib/db"; // Connection pool setup
import { NextResponse } from "next/server";

// GET endpoint: Fetch scoreboard data
export async function GET() {
  try {
    // Fetch scoreboard data where `id` is 1
    const [rows] = await db.query("SELECT * FROM scoreboard WHERE id = 1");

    // Handle the case where no data is found
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Scoreboard not found" },
        { status: 404 }
      );
    }
    // Return the first row as JSON
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT endpoint: Update scoreboard data
export async function PUT(request: Request) {
  try {
    // Parse the request body
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
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Update the scoreboard
    const [result] = await db.query(
      "UPDATE scoreboard SET team1_score = ?, team2_score = ?, team1_color = ?, team2_color = ?, timer = ?, team1_name = ?, team2_name = ?, period = ?, resetcount = ? WHERE id = 1",
      [
        team1_score,
        team2_score,
        team1_color,
        team2_color,
        timer,
        team1_name,
        team2_name,
        period,
        resetcount,
      ]
    );

    // Handle the case where no rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No rows affected. Check if the ID exists." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Scoreboard updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating scoreboard:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
