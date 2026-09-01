import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Co-Lab | Collaborative Workspace & Creative Notes",
  description: "Hand-drawn collaborative workspace for creative documents, team notes, and visual brainstorming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F5EC] text-[#30312C]">
        {children}
      </body>
    </html>
  );
}
