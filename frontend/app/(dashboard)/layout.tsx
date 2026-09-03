import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-[#F8F5EC] relative overflow-hidden font-body text-[#30312C]">
      {/* Top Navbar (High z-index z-40 over Sidebar and Main) */}
      <div className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </div>

      {/* Full-Height Left Sidebar (Fixed top-0 left-0 z-20) */}
      <Sidebar />

      {/* Dynamic Main Workspace Content */}
      <main className="h-full w-full pl-[256px] pt-[74px] overflow-y-auto bg-[#F8F5EC]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
