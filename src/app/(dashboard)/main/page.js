"use client";

import React, { useState } from "react";
import { Filter, Plus, X, Edit, Trash } from "lucide-react";

// Inline Button Component
const Button = ({ children, variant = "default", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition duration-200";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// Inline Dropdown Menu Component
const DropdownMenu = ({ children }) => {
  return <div className="relative">{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center px-4 py-2 border rounded-lg bg-gray-100">
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ isOpen, children }) => {
  return isOpen ? (
    <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg py-2 w-48 z-50">
      {children}
    </div>
  ) : null;
};

const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={onClick}>
      {children}
    </div>
  );
};

const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          {children}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };
  
  

const DialogContent = ({ children }) => <div className="space-y-4">{children}</div>;

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;

const DialogClose = ({ asChild, children }) => {
  return React.cloneElement(children, {
    onClick: () => {
      if (typeof children.props.onClick === "function") {
        children.props.onClick();
      }
    },
  });
};

export default function Products() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [products] = useState([
    { id: 1, name: "Product A", price: "$10", category: "Ibeauty", subcategory: "Ageless", disabled: false },
    { id: 2, name: "Product B", price: "$20", category: "Jtech", subcategory: "Ifresh", disabled: false },
  ]);
  const filters = ["All Products", "Jtech", "Ibeauty"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <div className="text-black flex flex-col items-start p-6 h-[550px]">
      {/* Welcome Back Message */}
      <div>
  <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
  <h1 className="text-2xl ml-5.5 top-2.5 font-bold mb-4 mt-5">Welcome back, Admin!</h1>
</div>

      
      {/* Product List */}
      <main className="p-6 flex-1 overflow-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">Product List</h2>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Filter className="w-4 h-4 mr-2" /> {selectedFilter}
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={dropdownOpen}>
              {filters.map((filter, index) => (
                <DropdownMenuItem key={index} onClick={() => { setSelectedFilter(filter); setDropdownOpen(false); }}>
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setModalOpen(true)} className="flex items-center bg-white p-3 rounded-2xl">
            <Plus className="w-4 h-4 mr-2" /> <span>Add Product</span>
          </Button>
        </div>

        {/* Product Table */}
        <table className="w-[900px] bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-200">
      <th className="px-4 py-2">Product Name</th>
      <th className="px-4 py-2">Price</th>
      <th className="px-4 py-2">Category</th>
      <th className="px-4 py-2">Subcategory</th>
      <th className="px-4 py-2">Actions</th> {/* Added this */}
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-2">{product.name}</td>
        <td className="px-4 py-2">{product.price}</td>
        <td className="px-4 py-2">{product.category}</td>
        <td className="px-4 py-2">{product.subcategory}</td>
        <td className="px-4 py-2 flex space-x-2"> {/* Actions column */}
          <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
            <Trash className="w-5 h-5" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </main>
      
      {/* Add Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <input type="text" placeholder="Product Name" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Price" className="w-full p-2 border rounded" />
            
            {/* Category Dropdown */}
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Jtech">Jtech</option>
              <option value="Ibeauty">Ibeauty</option>
            </select>
            
            {/* Show Subcategory only if "Ibeauty" is selected */}
            {selectedCategory === "Ibeauty" && (
              <select className="w-full p-2 border rounded" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                <option value="">Select Subcategory</option>
                <option value="Ageless">Ageless</option>
                <option value="Ifresh">Ifresh</option>
              </select>
            )}
            
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="default">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}