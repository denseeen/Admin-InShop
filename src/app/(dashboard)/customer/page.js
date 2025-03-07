"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Box,
  Users,
  Package,
  Edit,
  Trash,
} from "lucide-react";

// Custom Button Component
const Button = ({ children, variant = "default", size = "md", onClick }) => {
  const baseStyles = "px-4 py-2 rounded font-semibold focus:outline-none";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Custom Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children }) => <div>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4 font-bold">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-lg">{children}</h2>;
const DialogClose = ({ onClick }) => (
  <button className="absolute top-2 right-2 text-gray-500" onClick={onClick}>
    <X className="w-6 h-6" />
  </button>
);

export default function Customers() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customers, setCustomers] = useState([
    { id: 1, name: "Alice Smith", transaction: "5 Orders" },
    { id: 2, name: "Bob Johnson", transaction: "2 Orders" },
  ]);

  return (
    <div className="flex h-screen bg-gray-100 text-black">
     
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        <main className="p-6 flex-1 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Customer List</h2>
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Transaction History</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedCustomer(customer); setTransactionModalOpen(true); }}>
                      View
                    </Button>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      {/* Transaction History Modal */}
      {selectedCustomer && (
        <Dialog open={isTransactionModalOpen} onOpenChange={setTransactionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCustomer.name}'s Transaction History</DialogTitle>
              <DialogClose onClick={() => setTransactionModalOpen(false)} />
            </DialogHeader>
            <div className="p-4">
              <p>All transaction details for {selectedCustomer.name} will be displayed here.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setTransactionModalOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
