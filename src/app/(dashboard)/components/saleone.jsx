import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Saleone = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // Fetch sales data from your Laravel backend
    fetch('/api/sales-data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching sales data:', error));
  }, []);

  return (
    <div className=" w-[1000] grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Total Users */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl"
      >
        <h2 className="text-xl font-bold">Total Users</h2>
        <p className="text-4xl font-semibold mt-2">{data.totalUsers}</p>
      </motion.div>

      {/* Pending Orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl"
      >
        <h2 className="text-xl font-bold">Pending Orders</h2>
        <p className="text-4xl font-semibold mt-2">{data.pendingOrders}</p>
      </motion.div>

      {/* Completed Orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.05 }}
        className="bg-green-500 text-white p-6 rounded-2xl shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl"
      >
        <h2 className="text-xl font-bold">Completed Orders</h2>
        <p className="text-4xl font-semibold mt-2">{data.completedOrders}</p>
      </motion.div>
    </div>
  );
};

export default Saleone;
