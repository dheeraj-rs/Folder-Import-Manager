import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folder Import Manager",
  description: "Import and manage project folders with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}