import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaList,
  FaModx,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../store/AuthContext";
import { FaUsers } from "react-icons/fa";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  interface IsActiveProps {
    isActive: boolean;
  }
  // Function to determine if a NavLink is active
  const isActive = ({ isActive }: IsActiveProps) =>
    isActive ? "bg-green-800 text-white" : "text-gray-300 hover:bg-green-700";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 right-4 z-20 bg-green-600 text-white p-2 rounded-md"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-green-900 w-full md:w-64 md:min-h-screen transition-all duration-300 ease-in-out ${
          menuOpen ? "fixed inset-0 z-10" : "hidden md:block"
        }`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-white mb-8">WildPedia Admin</h1>

          <div className="flex flex-col gap-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-md ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-300 hover:bg-green-700"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaChartPie /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/species"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-md ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-300 hover:bg-green-700"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaList /> Species Management
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-md ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-300 hover:bg-green-700"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaUsers /> User Management
            </NavLink>

            <NavLink
              to="/admin/moderation"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-md ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-300 hover:bg-green-700"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaModx /> Content Moderation
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-md ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-300 hover:bg-green-700"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaChartLine /> Analytics
            </NavLink>
          </div>
        </div>

        <div className="p-4 border-t border-green-800 mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 rounded-md text-gray-300 hover:bg-green-700 w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
