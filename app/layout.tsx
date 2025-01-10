import { Provider } from "../components/ui/provider";
import { Theme } from "@chakra-ui/react";
import type { Metadata } from "next";
import { db } from "../lib/db";

export const metadata: Metadata = {
  title: "The Valley Scoreboard",
  description: "The Valley's Custom Scoreboard App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Theme appearance="light">{children}</Theme>
        </Provider>
      </body>
    </html>
  );
}

process.on("SIGINT", async () => {
  console.log("Gracefully shutting down database connection pool...");
  await db.shutdownHandler();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Gracefully shutting down database connection pool...");
  await db.shutdownHandler();
  process.exit(0);
});
