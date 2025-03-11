"use client";
import React, { useEffect, useState } from "react";
import { db } from "./../../../../script/firebaseConfig"; // Ensure this path is correct
import { collection, getDocs } from "firebase/firestore";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: `${doc.data().lastname || "No Last Name"}, ${doc.data().firstname || "No First Name"}`,
          address: doc.data().address || "No Address",
          contact: doc.data().contact || "No Contact",
          email: doc.data().email || "No Email",
        }));

        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 pt-72">
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
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border border-gray-300">
                <td className="px-4 py-2 border border-gray-300">{user.name}</td>
                <td className="px-4 py-2 border border-gray-300">{user.address}</td>
                <td className="px-4 py-2 border border-gray-300">{user.contact}</td>
                <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
