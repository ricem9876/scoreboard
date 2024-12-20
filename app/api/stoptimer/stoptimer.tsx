import { db } from "@/lib/db"; // Assuming db is set up properly
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2"; // Correct type for the result of UPDATE query

export async function PUT(request: Request) {
  try {
    // Parse incoming request body
    const { timerActive } = await request.json();
    console.log(timerActive);

    // Update the resetcount in the database
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE scoreboard SET timer = ${parseInt(timerActive)} WHERE id = 1`
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No rows affected. Check if the ID exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Reset count updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating reset count:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
