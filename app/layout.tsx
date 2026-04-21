import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hunger Games",
  description: "4-player food bidding survival game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
