import type { Metadata } from "next";
import { Bricolage_Grotesque, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Co-Lab | Collaborative Workspace & Creative Notes",
  description: "Collaborative workspace for creative documents, team notes, and visual brainstorming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${beVietnam.variable} h-full antialiased`}>
      <body className={`${beVietnam.className} min-h-full flex flex-col bg-[#F8F5EC] text-[#30312C]`}>
        {children}
      </body>
    </html>
  );
}
