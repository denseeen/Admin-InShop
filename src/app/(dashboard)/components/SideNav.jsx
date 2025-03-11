"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "./../../../../script/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth listener

export default function SidebarNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [adminName, setAdminName] = useState("Admin"); // Default value
  const router = useRouter();
  const dropdownRef = useRef(null);

  const categories = [
    { name: "Products", path: "/main" },
    { name: "Orders", path: "/orders" },
    { name: "Customers", path: "/customer" },
  ];

  useEffect(() => {
    const fetchAdminName = async (aid) => {
        if (!aid) return; // Exit if AID is not available

        try {
            const adminDocRef = doc(db, "admins", aid); // Using "admins" collection
            const adminDoc = await getDoc(adminDocRef);

            if (adminDoc.exists()) {
                const adminData = adminDoc.data();
                console.log("Admin Data from Firestore:", adminData);

                // Set admin name directly from Firestore
                setAdminName(adminData.fullName || "Admin");
            } else {
                console.log("Admin document does not exist in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Authenticated Admin:", user);
            fetchAdminName(user.uid); // Pass user UID as AID
        } else {
            console.log("No authenticated admin found.");
        }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
}, []);



  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning!");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon!");
    } else {
      setGreeting("Good Evening!");
    }

    const savedTheme = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

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

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <div className={`relative h-screen overflow-hidden z-10 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <nav className={`p-4 shadow-md w-full fixed top-0 z-50 h-16 flex justify-between items-center px-6 ${isDarkMode ? "bg-gray-800" : "bg-blue-500"}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl p-2 rounded-md shadow-md">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        <div className="relative flex items-center space-x-4">
          <div className="whitespace-nowrap">{`${greeting}, ${adminName}`}</div>

          <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors">
            {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-200" />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-600">
              <User className="w-6 h-6" />
            </button>

            {isDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-48 shadow-md rounded-md py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                <button onClick={() => router.push("/profile")} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Settings className="w-5 h-5 mr-2" /> Settings
                </button>
                <button onClick={() => router.push("/")} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={`fixed top-0 left-0 h-full w-60 p-5 shadow-lg z-10 ${isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"}`}
      >
        <ul className="mt-16 space-y-4">
          {categories.map((category, index) => (
            <li key={index} className="p-2 hover:bg-blue-600 hover:text-white rounded-md cursor-pointer" onClick={() => { setIsSidebarOpen(false); router.push(category.path); }}>
              {category.name}
            </li>
          ))}
        </ul>
      </motion.aside>
    </div>
  );
}
