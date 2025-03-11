"use client";
import { useState, useEffect } from "react";
import { db } from "./../../../../script/firebaseConfig";
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 100;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        let allOrders = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const shippingInfoRef = collection(db, `users/${userId}/shippingInformation`);
          const shippingInfoSnapshot = await getDocs(shippingInfoRef);
          let shippingInfoData = shippingInfoSnapshot.docs.map(doc => doc.data())[0];

          const shippingStatusRef = collection(db, `users/${userId}/shippingstatus`);
          const shippingStatusSnapshot = await getDocs(shippingStatusRef);

          const ordersList = shippingStatusSnapshot.docs.map(doc => ({
            id: doc.id,
            userId: userId,
            ...doc.data(),
            shippingInformation: shippingInfoData || {},
          }));

          allOrders = [...allOrders, ...ordersList];
        }

        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, userId) => {
    setUpdatingOrderId(orderId);
    try {
      const orderRef = doc(db, `users/${userId}/shippingstatus`, orderId);
      await updateDoc(orderRef, { status: "Complete" });
      setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: "Complete" } : order));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.productPrice > 0 && 
    (filter === "all" || 
    (filter === "complete" && order.status.toLowerCase() === "complete") || 
    (filter === "pending" && order.status.toLowerCase() === "pending"))
  );
  
  

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <p className="mt-2 text-gray-700 font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen text-black bg-white p-4 overflow-hidden">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 overflow-auto fixed top-20 left-1/2 transform -translate-x-1/2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-center">Orders</h2>
        <div className="flex justify-center mb-4">
          <select className="border px-4 py-2 rounded" onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="overflow-x-auto flex justify-center max-h-[70vh]">
          <table className="w-full max-w-7xl bg-white border border-gray-200 shadow-md rounded-lg text-center">
            <thead>
              <tr className="bg-gray-200 text-xs sm:text-sm md:text-base">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-10 py-2">Address</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No orders found</td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-100 text-xs sm:text-sm md:text-base">
                    <td className="px-4 py-2">{order.shippingInformation?.firstName} {order.shippingInformation?.lastName}</td>
                    <td className="px-4 py-2">{order.shippingInformation?.contactNumber}</td>
                    <td className="px-4 py-2">{order.shippingInformation?.email}</td>
                    <td className="px-10 py-2">{order.shippingInformation?.shippingAddress}</td>
                    <td className="px-4 py-2">{order.productName}</td>
                    <td className="px-4 py-2">{order.productQuantity}</td>
                    <td className="px-4 py-2">${order.productPrice}</td>
                    <td className="px-4 py-2">
                      <select
                        onChange={(e) => handleStatusChange(order.id, order.userId, e.target.value)}
                        value={order.status}
                        className={`border px-2 py-1 rounded 
                          ${order.status === "Complete" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}
                      >
                        <option value="Pending" className="bg-orange-500 text-white">
                          Pending
                        </option>
                        <option value="Complete" className="bg-blue-500 text-white">
                          Complete
                        </option>
                      </select>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}