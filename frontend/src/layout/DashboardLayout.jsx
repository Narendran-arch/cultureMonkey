import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import Topbar from "../components/ui/Topbar";

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
