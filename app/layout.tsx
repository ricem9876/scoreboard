import { Provider } from "@/components/ui/provider";
import { Theme } from "@chakra-ui/react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "The Valley Scoreboard",
  description: "The Valley's Custom Scoreboard App",
};
// const queryClient = new QueryClient();
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
        </Provider>{" "}
      </body>
    </html>
  );
}
