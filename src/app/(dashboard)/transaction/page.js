"use client";
import { useState, useEffect } from "react";
import { db } from "./../../../../script/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion"; // Import Framer Motion

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        let allTransactions = [];
        const todayDate = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

        for (let userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;

          // Fetch all "Complete" orders from shippingstatus
          const shippingStatusQuery = query(
            collection(db, "users", userId, "shippingstatus"),
            where("status", "==", "Complete")
          );
          const shippingStatusSnapshot = await getDocs(shippingStatusQuery);

          if (!shippingStatusSnapshot.empty) {
            // Fetch firstName & lastName from shippingInformation
            const shippingInfoSnapshot = await getDocs(collection(db, "users", userId, "shippingInformation"));
            let firstName = "";
            let lastName = "";

            if (!shippingInfoSnapshot.empty) {
              const shippingInfoDoc = shippingInfoSnapshot.docs[0];
              firstName = shippingInfoDoc.data().firstName;
              lastName = shippingInfoDoc.data().lastName;
            }

            // Loop through each "Complete" order and store details
            shippingStatusSnapshot.forEach((orderDoc) => {
              const { productName, productPrice, productQuantity } = orderDoc.data();

              allTransactions.push({
                id: userId, // Store user ID to save data later
                name: `${firstName} ${lastName}`,
                transactionId: "", // Admin input
                date: todayDate, // Default to today
                product: productName,
                type: "Select", // Default selection
                price: productPrice,
                quantity: productQuantity,
              });
            });
          }
        }

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchTransactions();
  }, []);

  // Handle input changes
  const handleChange = (index, field, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index][field] = value;
    setTransactions(updatedTransactions);
  };

  // Handle Submit button click
  const handleSubmit = async (index) => {
    const transaction = transactions[index];

    if (!transaction.transactionId || transaction.type === "Select") {
      alert("Please enter Transaction ID and select a Type.");
      return;
    }

    try {
      const transactionRef = doc(collection(db, "users", transaction.id, "transactionhistory"));
      await setDoc(transactionRef, {
        transactionId: transaction.transactionId,
        date: transaction.date,
        product: transaction.product,
        type: transaction.type,
        price: transaction.price,
        quantity: transaction.quantity,
      });

      alert("Transaction successfully added to history!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction.");
    }
  };

  // **Loading Screen**
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

        {/* Surface */}
        <div className="w-24 h-2 bg-gray-700 rounded-md mt-2 shadow-md relative z-10" />
        <p className="mt-2 text-gray-700 font-semibold text-lg">Loading...</p>
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
      <div className="container mx-auto p-5">
        <h2 className="text-xl font-bold mb-4">Transaction Table</h2>

        {/* Scroll only if transactions > 5 */}
        <div className={`border rounded-lg overflow-hidden ${transactions.length > 5 ? "max-h-80 overflow-y-auto" : ""}`}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Transaction ID</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="border p-2">{transaction.name}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={transaction.transactionId}
                      onChange={(e) => handleChange(index, "transactionId", e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="Enter Transaction ID"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="date"
                      value={transaction.date}
                      onChange={(e) => handleChange(index, "date", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">{transaction.product}</td>
                  <td className="border p-2">
                    <select
                      value={transaction.type}
                      onChange={(e) => handleChange(index, "type", e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="Select">Select</option>
                      <option value="iBeauty">iBeauty</option>
                      <option value="jTech">jTech</option>
                    </select>
                  </td>
                  <td className="border p-2">{transaction.price}</td>
                  <td className="border p-2">{transaction.quantity}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleSubmit(index)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
