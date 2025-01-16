/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: any) {
  try {
    // Parse incoming request body
    const { timerActive } = await request.json();
    console.log("Timer Active:", timerActive);

    // Update the timer in the database using Prisma
    const result = await prisma.scoreboard.update({
      where: { id: 1 },
      data: { timer: timerActive ? 1 : 0 },
    });

    // Check if the update was successful
    if (!result) {
      return NextResponse.json(
        { message: "Failed to update timer" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Timer updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating timer:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}
