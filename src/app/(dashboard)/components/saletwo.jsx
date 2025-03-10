import React, { useState } from "react";
import { motion } from "framer-motion";

const Saletwo = () => {
  const [rows, setRows] = useState([
    { startDate: "", endDate: "", totalRevenue: "" },
  ]);

  const products = [
    { name: "Product A", quantity: 10 },
    { name: "Product B", quantity: 5 },
    { name: "Product C", quantity: 8 },
    { name: "Product D", quantity: 12 },
    { name: "Product E", quantity: 7 },
    { name: "Product F", quantity: 6 },
    { name: "Product G", quantity: 9 },
    { name: "Product H", quantity: 4 },
    { name: "Product I", quantity: 11 },
    { name: "Product J", quantity: 15 },
  ];

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", { rows });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-center p-6 gap-8"
    >
      {/* Product Sales Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-white shadow-lg rounded-lg p-4 border border-gray-300"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Product Sales</h2>
        <div className="overflow-y-auto max-h-60 border border-gray-400 rounded">
          <table className="border-collapse border border-gray-400 w-full text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-400 p-2">Product Name</th>
                <th className="border border-gray-400 p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="border border-gray-400 p-2">{product.name}</td>
                  <td className="border border-gray-400 p-2">{product.quantity}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Revenue Calculator Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-4 border border-gray-300 w-full md:w-1/2"
      >
       <h2 className="text-xl font-bold mb-4 text-center">Calculator of Revenue</h2>
<table className="border-collapse border border-gray-400 w-full text-center">
  <thead className="bg-gray-200">
    <tr>
      <th className="border border-gray-400 p-2">Start Date</th>
      <th className="border border-gray-400 p-2">End Date</th>
      <th className="border border-gray-400 p-2">Total Revenue</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, index) => (
      <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <td className="border border-gray-400 p-2">
          <input
            type="date"
            value={row.startDate}
            onChange={(e) => handleChange(index, "startDate", e.target.value)}
            className="p-1 border rounded w-full"
          />
        </td>
        <td className="border border-gray-400 p-2">
          <input
            type="date"
            value={row.endDate}
            onChange={(e) => handleChange(index, "endDate", e.target.value)}
            className="p-1 border rounded w-full"
          />
        </td>
        <td className="border border-gray-400 p-2 font-bold text-green-600">
          {row.totalRevenue} {/* Just a display, no input field */}
        </td>
      </motion.tr>
    ))}
  </tbody>
</table>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="mt-10 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
        >
          Submit
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Saletwo;