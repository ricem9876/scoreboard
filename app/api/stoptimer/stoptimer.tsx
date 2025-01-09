import { db } from "@/lib/db"; // Assuming db is set up properly
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    // Parse incoming request body
    const { timerActive } = await request.json();
    console.log(timerActive);

    // Update the resetcount in the database
    const [result] = await db.query(
      `UPDATE scoreboard SET timer = ${timerActive ? 1 : 0} WHERE id = 1`
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No rows affected. Check if the ID exists." },
        { status: 404 }
      );
    }
    db.shutdownHandler();
    return NextResponse.json(
      { message: "Reset count updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating reset count:", error);
    db.shutdownHandler();
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
