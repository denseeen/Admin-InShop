"use client";
import { useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([
    {
      orderNo: "1001",
      transactionNo: "T12345",
      customerName: "Alice Smith",
      products: "Laptop",
      quantity: 1,
      status: "Shipped",
    },
    {
      orderNo: "1002",
      transactionNo: "T12346",
      customerName: "Bob Johnson",
      products: "Phone",
      quantity: 2,
      status: "Processing",
    },
  ]);

  return (
    <div className="flex justify-center items-center min-h-screen text-black bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="w-full sm:w-11/12 md:w-5/5 lg:w-4/4 max-w-6xl bg-white shadow-lg rounded-md md:rounded-lg p-3 sm:p-5 md:p-6">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-4 text-center">
          Orders
        </h2>

        <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg table-fixed">
          <thead>
            <tr className="bg-gray-200 text-center text-[9px] sm:text-xs md:text-sm lg:text-base">
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/6 truncate">Order No</th>
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/6 truncate">Transaction No</th>
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/4 truncate">Customer Name</th>
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/6 truncate">Products</th>
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/6 truncate">Quantity</th>
              <th className="px-1 sm:px-3 md:px-4 py-2 w-1/6 truncate">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNo} className="text-center border-b hover:bg-gray-100 text-[10px] sm:text-xs md:text-sm lg:text-base">
                <td className="px-1 sm:px-3 md:px-4 py-2 break-words">{order.orderNo}</td>
                <td className="px-1 sm:px-3 md:px-4 py-2 break-words">{order.transactionNo}</td>
                <td className="px-1 sm:px-3 md:px-4 py-2 break-words truncate">{order.customerName}</td>
                <td className="px-1 sm:px-3 md:px-4 py-2 break-words truncate">{order.products}</td>
                <td className="px-1 sm:px-3 md:px-4 py-2 break-words">{order.quantity}</td>
                <td className={`px-1 sm:px-3 md:px-4 py-2 font-semibold break-words ${
                    order.status === "Shipped" ? "text-green-600" : "text-yellow-600"
                  }`}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
