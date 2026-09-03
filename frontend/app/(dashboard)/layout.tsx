import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F5EC] flex flex-col font-hand text-[#30312C]">
      {/* Top Shared Navbar */}
      <Navbar />

      {/* Main Container: Sidebar + Content */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Shared Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8F5EC] min-h-[calc(100vh-74px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
