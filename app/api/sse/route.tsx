/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: any) {
  const stream = new ReadableStream({
    async start(controller) {
      const intervalId = setInterval(async () => {
        try {
          // Fetch scoreboard data
          const scoreboard = await prisma.scoreboard.findUnique({
            where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
            select: {
              id: true,
              team1_name: true,
              team1_score: true,
              team2_name: true,
              team2_score: true,
              timer: true,
              period: true,
              resetcount: true,
              team1_color: true,
              team2_color: true,
              team1_fouls: true,
              team2_fouls: true,
            },
          });

          // console.log({ scoreboard });

          // Handle the case where no data is found
          if (!scoreboard) {
            // controller.enqueue(
            //   `data: ${JSON.stringify({ message: "Scoreboard not found" })}\n\n`
            // );
          } else {
            controller.enqueue(`data: ${JSON.stringify(scoreboard)}\n\n`);
          }
        } catch (error) {
          // console.error("Error fetching scoreboard data:", error);
          console.log(error);
          // controller.enqueue(
          //   `data: ${JSON.stringify({ message: "Internal Server Error" })}\n\n`
          // );
        }
      }, 1000);

      request.signal.addEventListener("abort", async () => {
        clearInterval(intervalId);
        controller.close();
        await prisma.$disconnect();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
