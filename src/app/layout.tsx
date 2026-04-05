import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { BaseLayout, CustomToaster, QueryProvider } from "@/shared";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const tradeGothic = localFont({
  src: "../../public/font/trade-gothic-lt-bold.ttf",
  weight: "bold",
  variable: "--font-trade-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Order 8x8 in. Photo Tile Prints | Stick Your Pics to Your Walls",
  description:
    "Order premium 8x8 in. stickable photo tiles. Decorate with your pics. Select, crop & submit. No wall damage. Won't fade or warp. Free shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${tradeGothic.variable}`}
    >
      <body className={roboto.className} suppressHydrationWarning>
        <NuqsAdapter>
          <QueryProvider>
            <BaseLayout>{children}</BaseLayout>
            <CustomToaster />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
