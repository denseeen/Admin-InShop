import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "./../../../../script/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Saleone = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        let totalUsers = usersSnapshot.size;
        let pendingOrders = 0;
        let completedOrders = 0;

        console.log(`Total Users: ${totalUsers}`);

        const fetchShippingPromises = usersSnapshot.docs.map(async (userDoc) => {
          const shippingStatusRef = collection(db, "users", userDoc.id, "shippingstatus");
          const shippingSnapshot = await getDocs(shippingStatusRef);

          console.log(`User: ${userDoc.id}, Shipping Records: ${shippingSnapshot.size}`);

          shippingSnapshot.docs.forEach((doc) => {
            const status = doc.data().status?.trim().toLowerCase(); // Normalize status

            console.log(`Order ID: ${doc.id}, Status: ${status}`);

            if (status === "pending") {
              pendingOrders++;
            } else if (status === "complete") {
              completedOrders++;
            }
          });
        });

        await Promise.all(fetchShippingPromises);

        console.log(`Final Pending Orders Count: ${pendingOrders}`);
        console.log(`Final Completed Orders Count: ${completedOrders}`);

        setData({ totalUsers, pendingOrders, completedOrders });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg text-center"
      >
        <h2 className="text-xl font-bold">Total Users</h2>
        <p className="text-4xl font-semibold mt-2">{data.totalUsers}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg text-center"
      >
        <h2 className="text-xl font-bold">Pending Orders</h2>
        <p className="text-4xl font-semibold mt-2">{data.pendingOrders}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="bg-green-500 text-white p-6 rounded-2xl shadow-lg text-center"
      >
        <h2 className="text-xl font-bold">Completed Orders</h2>
        <p className="text-4xl font-semibold mt-2">{data.completedOrders}</p>
      </motion.div>
    </div>
  );
};

export default Saleone;
