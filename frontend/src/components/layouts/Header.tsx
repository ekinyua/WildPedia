import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaCamera,
  FaUserCog,
  FaLeaf,
  FaTrophy,
} from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";
import { getUserStats } from "../../services/learnService";
import { UserStats } from "../../models";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const stats = await getUserStats();
          setUserStats(stats);
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <header className="">
      <div className="max-w-9xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <FaLeaf className="text-green-600 text-xl" />
            <span className="text-xl font-bold text-green-600">WildPedia</span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative w-1/3"
          >
            <input
              type="search"
              placeholder="Search for species...."
              className="border rounded-full pl-4 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="p-1 rounded-full bg-green-600 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              title="Search"
            >
              <IoMdSearch className="text-white" size={18} />
            </button>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="/learn"
              className="text-gray-700 hover:text-green-600 cursor-pointer"
            >
              Learn
            </Link>

            {user && (
              <Link
                to="/leaderboard"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Leaderboard
              </Link>
            )}

            <Link
              to="/organizations"
              className="text-gray-700 hover:text-green-600 cursor-pointer"
            >
              Organizations
            </Link>

            {/* Always show Identify button if user is logged in */}
            {user && (
              <Link
                to="/identify"
                className="text-gray-700 hover:text-green-600 flex items-center cursor-pointer"
              >
                <FaCamera className="mr-1" /> Identify
              </Link>
            )}

            {user && userStats && (
              <div className="hidden md:flex items-center mr-4 bg-gray-50 rounded-full px-3 py-1">
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-500 mr-1" />
                  <span className="font-bold text-gray-700 text-xs">
                    {userStats.xp} XP
                  </span>
                </div>
              </div>
            )}

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? "true" : "false"}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-100">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.username}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-600">
                        <FaUser />
                      </div>
                    )}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaUserCog className="inline mr-2" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
              >
                <MdOutlineLogin className="mr-1" /> Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 space-y-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="search"
                placeholder="Search for species..."
                className="border rounded-full pl-4 pr-10 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="p-1 rounded-full bg-green-600 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                title="search"
              >
                <IoMdSearch className="text-white" size={18} />
              </button>
            </form>
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-green-600 cursor-pointer"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/learn"
              className="block py-2 text-gray-700 hover:text-green-600 cursor-pointer"
              onClick={() => setShowMobileMenu(false)}
            >
              Learn
            </Link>
            <Link
              to="/organizations"
              className="block py-2 text-gray-700 hover:text-green-600 cursor-pointer"
              onClick={() => setShowMobileMenu(false)}
            >
              Organizations
            </Link>
            {user ? (
              <>
                <Link
                  to="/identify"
                  className="py-2 text-gray-700 hover:text-green-600 flex items-center cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaCamera className="mr-2" /> Identify Species
                </Link>
                <Link
                  to="/profile"
                  className="py-2 text-gray-700 hover:text-green-600 flex items-center cursor-pointer"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaUserCog className="mr-2" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-gray-700 hover:text-green-600 flex items-center cursor-pointer"
                  title="logout"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-gray-700 hover:text-green-600 cursor-pointer"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
