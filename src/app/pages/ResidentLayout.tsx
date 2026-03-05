import { Outlet, NavLink } from "react-router";
import ResidentHeader from "../components/ResidentHeader";
import { LayoutDashboard, User, FileText, Clock } from "lucide-react";

export default function ResidentLayout() {
  const navItems = [
    { path: "/resident", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/resident/profile", icon: User, label: "Profile" },
    { path: "/resident/requests", icon: FileText, label: "Requests" },
    { path: "/resident/status", icon: Clock, label: "Status" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ResidentHeader />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] fixed left-0 top-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
