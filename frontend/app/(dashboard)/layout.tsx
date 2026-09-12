"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalShortcutsHandler } from "@/components/layout/GlobalShortcutsHandler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen w-screen bg-[#F8F5EC] relative overflow-hidden font-body text-[#30312C]">
      <GlobalShortcutsHandler />
      {/* Top Navbar (High z-index z-40 over Sidebar and Main) */}
      <div className="fixed top-0 left-0 w-full z-40">
        <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      </div>

      {/* Full-Height Left Sidebar (Fixed top-0 left-0 z-20) */}
      <Sidebar isCollapsed={!isSidebarOpen} />

      {/* Dynamic Main Workspace Content */}
      <main
        className={`h-full w-full pt-[74px] overflow-y-auto bg-[#F8F5EC] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "pl-[256px]" : "pl-0"
        }`}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
