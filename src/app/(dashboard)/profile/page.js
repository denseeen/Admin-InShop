"use client";
import React, { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import { db, auth } from "../../../../script/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion"; // Import Framer Motion

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (admin) => {
      if (admin) {
        console.log("Admin ID:", admin.uid);
        try {
          const adminRef = doc(db, "admins", admin.uid); // Fetch from admins table
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            console.log("Admin data:", adminSnap.data());
            setProfile(adminSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.log("No admin logged in.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white relative overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent bg-[length:20px_1px] bg-repeat-x"
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

  if (!profile) return <p className="text-center text-lg text-red-500">No profile data found.</p>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-center items-center min-h-screen bg-white"
    >
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
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
