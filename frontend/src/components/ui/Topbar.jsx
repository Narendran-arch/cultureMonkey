import { Menu } from "lucide-react";

export default function Topbar({ setIsMobileOpen }) {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 lg:hidden">
      <button onClick={() => setIsMobileOpen(true)}>
        <Menu />
      </button>
      <h1 className="ml-4 font-semibold">Dashboard</h1>
    </header>
  );
}