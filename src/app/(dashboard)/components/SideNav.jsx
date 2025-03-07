"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);

  const categories = [
    { name: "Products", path: "/main" },
    { name: "Orders", path: "/orders" },
    { name: "Customers", path: "/customer" },
  ];

  const adminName = "Admin Name"; // Replace with actual admin name fetching logic

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning!");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon!");
    } else {
      setGreeting("Good Evening");
    }

    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <div className={`relative h-screen overflow-hidden z-10 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Navbar */}
      <nav className={`p-4 shadow-md w-full fixed top-0 z-50 h-16 flex justify-between items-center px-6 ${isDarkMode ? "bg-gray-800" : "bg-blue-500"}`}>
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl p-2 rounded-md shadow-md"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Admin Profile Section */}
        <div className="relative flex items-center space-x-4">
          {/* Greeting */}
          <div className="whitespace-nowrap">{`${greeting}, ${adminName}`}</div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-200" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-600"
            >
              <User className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-48 shadow-md rounded-md py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                <button
                  onClick={() => router.push("/settings")}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Settings className="w-5 h-5 mr-2" /> Settings
                </button>
                <button
                  onClick={() => router.push("/logout")}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={`fixed top-0 left-0 h-full w-60 p-5 shadow-lg z-10 ${isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"}`}
      >
        <ul className="mt-16 space-y-4">
          {categories.map((category, index) => (
            <li
              key={index}
              className="p-2 hover:bg-blue-600 hover:text-white rounded-md cursor-pointer"
              onClick={() => {
                setIsSidebarOpen(false);
                router.push(category.path);
              }}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </motion.aside>
    </div>
  );
}
