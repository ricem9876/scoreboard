import { db } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: any) {
  const stream = new ReadableStream({
    async start(controller) {
      const intervalId = setInterval(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [rows] = await db.query("SELECT * FROM scoreboard LIMIT 1");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newRows: any = rows;
        // console.log({ response: newRows[0] });
        controller.enqueue(`data: ${JSON.stringify(newRows[0])}\n\n`);
      }, 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
