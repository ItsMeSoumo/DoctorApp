import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Badge } from "antd";
import '@ant-design/v5-patch-for-react-19';
import { BellOutlined } from "@ant-design/icons";
import { adminMenu, userMenu, doctorMenu } from "../Data/data";
import { useSelector, useDispatch } from 'react-redux';
import { axiosinstance } from '../components/utilities/axiosinstance.js';
import { setUser } from '../redux/features/user.slice.js';

// Assets
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(userMenu);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  // 🔄 Fetch user data on mount & when pathname changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getUserData = async () => {
        try {
          const res = await axiosinstance.get("/user/getUserData");
          if (res.data.success) {
            dispatch(setUser(res.data.data));
          }
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            dispatch(setUser(null));
          }
        }
      };
      getUserData();
    } else {
      dispatch(setUser(null));
    }
  }, [location.pathname, dispatch]);

  // Calculate unread notifications count
  const unreadNotificationsCount = user?.notification?.length || 0;

  // 🔄 Update menu based on user
  useEffect(() => {
    if (!user) {
      setCurrentMenu(userMenu);
    } else if (user.isAdmin) {
      setCurrentMenu(adminMenu);
    } else if (user.isDoctor && user._id) {
      setCurrentMenu(doctorMenu(user));
    } else {
      setCurrentMenu(userMenu);
    }
  }, [user]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xl font-bold text-blue-600">AURAHEALTH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            )}

            {user && (
              <Badge
                count={unreadNotificationsCount}
                onClick={() => navigate("/notification")}
                size="small"
                className="ml-4 cursor-pointer"
                style={{ backgroundColor: unreadNotificationsCount > 0 ? '#ff4d4f' : '#52c41a' }}
              >
                <BellOutlined
                  className={`text-gray-600 hover:text-blue-600 ${unreadNotificationsCount > 0 ? 'animate-bounce' : ''}`}
                  style={{ fontSize: "24px" }}
                />
              </Badge>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg pb-4">
            <div className="px-2 pt-2 space-y-1">
              {currentMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "text-white bg-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {user && (
              <div className="pt-4 border-t border-gray-200 px-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;