import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import BackgroundElements from "@/components/BackgroundElements";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Citiline | Creative Advertising & Printing Agency",
  description: "Where creativity meets precision. Citiline is a premium advertising and high-end printing agency focused on visual storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-background text-foreground`}>
        <div className="noise-overlay" />
        <BackgroundElements />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
