import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "./context/session-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buggy",
  description:
    "Buggy makes splitting bills with friends simple. Snap a photo of the bill,settle balances instantly, and avoid awkward money chats. Try Buggy today!",
  keywords: [
    "take picture and split bill",
    "snap a picture",
    "split bill",
    "bill splitting",
    "bill splitting app",
    "split bills with friends",
    "group expenses app",
    "expense sharing",
    "roommate expenses",
    "travel expense tracker",
    "split payment app",
    "bill splitter app",
    "ocr text extraction",
    "deepseek ocr",
    "ai ocr",
    "receipt ocr",
    "split bill app",
  ],
  metadataBase: new URL("https://buggy.prosh2.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
