import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarOffsetClass = isSidebarOpen ? "ml-64" : "ml-[4.75rem]";

  return (
    <div className="flex min-h-screen w-full bg-[#1C4452] text-white">
      {/* Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Dashboard */}
      <main
        className={`
          flex-1 
          ${sidebarOffsetClass}
          bg-[#DDEEF3]
          p-6
          overflow-auto
          transition-all 
          duration-300
          text-gray-900
        `}
      >
        {/* SINGLE CONTENT AREA ONLY */}
        <div
          className="
            bg-white
            shadow-xl
            rounded-xl
            p-6
            mt-4
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
