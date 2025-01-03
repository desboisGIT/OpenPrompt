import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPrompt | The Open Source Prompt Library",
  description:
    "OpenPrompt is a collection of open source prompts for your projects.",
  authors: [
    {
      name: "desboisGIT",
    },
    {
      name: "trifledmatter",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
