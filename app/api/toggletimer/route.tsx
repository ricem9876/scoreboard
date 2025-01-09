/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db"; // Assuming db is set up properly
import { NextResponse } from "next/server";

export async function PUT(request: any) {
  try {
    // Parse incoming request body
    const { timerActive } = await request.json();
    console.log("Timer Active:", timerActive);

    // Use parameterized query to prevent SQL injection
    const [result] = await db.query(
      `UPDATE scoreboard SET timer = ? WHERE id = ?`,
      [timerActive ? 1 : 0, 1]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No rows affected. Check if the ID exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Toggled clock successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling clock:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
