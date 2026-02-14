import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/Dashboard" },
    { name: "Company", icon: Building2, path: "/companies" },
    { name: "Users", icon: Users, path: "/users" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
    fixed lg:static z-50 h-full
    bg-[#070B1A]
    bg-[radial-gradient(circle_at_20%_20%,rgba(64,224,208,0.12),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(64,224,208,0.08),transparent_45%)]
    text-white
    transition-all duration-300
    ${isCollapsed ? "w-16" : "w-64"}
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* Logo + collapse button */}
        <div  className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
          {!isCollapsed && (
           <Link to={"/"}><span className="font-semibold text-sm">Culture Monkey</span></Link> 
          )}

          {/* Desktop collapse */}
          <button
            className="hidden lg:block"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {/* Mobile close */}
          <button className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-1 px-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-3 py-2 rounded-lg
                text-sm
                ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `
              }
            >
              <item.icon size={18} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
