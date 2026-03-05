import { useState, useRef, useEffect } from "react";
import { Building2, Bell, Menu, User, Lock, LogOut } from "lucide-react";
import { mockUser } from "../data/mockData";
import { useNavigate } from "react-router";

export default function ResidentHeader() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleChangePassword = () => {
    alert("Change password functionality");
    setShowProfileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Barangay San Isidro</div>
              <div className="text-xs text-gray-600">Resident Portal</div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Menu Button */}
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Menu className="w-6 h-6" />
            </button>

            {/* Notification */}
            <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Username */}
            <span className="hidden sm:block text-gray-700">{mockUser.username}</span>

            {/* Profile Icon with Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={handleChangePassword}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
