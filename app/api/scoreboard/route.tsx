// app/api/scoreboard/route.ts

import { db } from "@/lib/db"; // Assuming db is set up properly
import { OkPacket } from "mysql2";
import { NextResponse } from "next/server";
// import { OkPacket } from "mysql2";

export async function PUT(request: Request) {
  console.log({ request });
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
    } = await request.json();

    // Validate the input
    if (
      typeof team1_score !== "number" ||
      typeof team2_score !== "number" ||
      typeof timer !== "number" ||
      !/^#[0-9A-Fa-f]{6}$/.test(team1_color) ||
      !/^#[0-9A-Fa-f]{6}$/.test(team2_color)
    ) {
      return new NextResponse("Invalid input data", { status: 400 });
    }

    // Update the scoreboard in the database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result] = await db.query<OkPacket>(
      "UPDATE scoreboard SET team1_score = ?, team2_score = ?, team1_color = ?, team2_color = ?, timer = ?, team1_name = ?, team2_name = ? WHERE id = 1",
      [
        team1_score,
        team2_score,
        team1_color,
        team2_color,
        timer,
        team1_name,
        team2_name,
      ]
    );

    // Access the affectedRows property from OkPacket
    const affectedRows = result.affectedRows;

    // Handle potential errors from the query
    if (affectedRows === 0) {
      return new NextResponse("No rows affected. Check if the ID exists.", {
        status: 404,
      });
    }

    return new NextResponse("Scoreboard updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating scoreboard:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
