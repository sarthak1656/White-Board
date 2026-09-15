import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whiteboard | Interactive Canvas Workspace",
  description:
    "A high-performance interactive infinite canvas whiteboard built for seamless visual brainstorming and diagramming.",
  keywords: [
    "whiteboard",
    "canvas",
    "diagramming",
    "tldraw",
    "visual workspace",
    "brainstorming",
  ],
  authors: [{ name: "Sarthak Panigrahi" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: "/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    title: "White Board",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Whiteboard | Interactive Canvas Workspace",
    description:
      "A high-performance interactive infinite canvas whiteboard built for seamless visual brainstorming and diagramming.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#f7f9fa",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
