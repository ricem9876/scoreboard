import { db } from "@/lib/db"; // Assuming db is set up properly
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2"; // Correct type for the result of UPDATE query

// GET endpoint: Fetch scoreboard data from the database
export async function GET() {
  try {
    // Execute the query to fetch the scoreboard data (expecting rows as the first result)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await db.query("SELECT * FROM scoreboard WHERE id = 1");

    // Check if rows are returned, then return the first row (or handle no data found)
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Scoreboard not found" },
        { status: 404 }
      );
    }

    // Return the found record as JSON
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT endpoint: Update scoreboard data in the database
export async function PUT(request: Request) {
  try {
    // Parse incoming request body
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

    // Update the scoreboard in the database
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE scoreboard SET team1_score = ?, team2_score = ?, team1_color = ?, team2_color = ?, timer = ?, team1_name = ?, team2_name = ?, period = ? WHERE id = 1",
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

    // Check if any rows were affected
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
