import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    // Parse incoming request body
    const { previouscount } = await request.json();

    // Validate the input
    const parsedCount = parseInt(previouscount);
    if (isNaN(parsedCount)) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Update the resetcount in the database using Prisma
    const result = await prisma.scoreboard.update({
      where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
      data: { resetcount: parsedCount + 1 },
    });

    // Check if the update was successful
    if (!result) {
      return NextResponse.json(
        { message: "Failed to update resetcount" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Resetcount updated successfully" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating resetcount:", error);
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
