"use client";
import React, { useEffect, useState } from "react";
import { db } from "./../../../../script/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react"; // Importing UserCircle icon

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [profile, setProfile] = useState(null); // Added profile state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          fullName: `${doc.data().lastname || "No Last Name"}, ${doc.data().firstname || "No First Name"}`,
          address: doc.data().address || "No Address",
          contact: doc.data().contact || "No Contact",
          email: doc.data().email || "No Email",
        }));

        setUsers(userData);
        setProfile(userData[0] || null); // Set the first user as profile (if exists)
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white relative overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
        />

        <motion.div
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 bg-blue-500 rounded-full relative z-10"
        />

        <div className="w-24 h-2 bg-gray-700 rounded-md mt-2 shadow-md relative z-10" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-center items-center min-h-screen bg-white"
    >
      {profile && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          </motion.div>

          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            className="text-left space-y-3"
          >
            <p>
              <strong>Name:</strong> {profile.fullName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
          </motion.div>
        </motion.div>
      )}

      <div className="p-6 pt-5">
        <h2 className="text-xl font-semibold mb-4 text-center">Customer List</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 border border-gray-300">
                <th className="px-4 py-2 border border-gray-300">Names</th>
                <th className="px-4 py-2 border border-gray-300">Address</th>
                <th className="px-4 py-2 border border-gray-300">Contact No</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                {/* <th className="px-4 py-2 border border-gray-300">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border border-gray-300">
                  <td className="px-4 py-2 border border-gray-300">{user.fullName}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.address}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.contact}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                  {/* <td className="px-4 py-2 border border-gray-300 text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
