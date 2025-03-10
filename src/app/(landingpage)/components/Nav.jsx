

export default function Navbar() {

  return (  
    <>
      <nav className="flex items-center justify-between p-4 bg-[#4DC5D6] shadow-md">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
        <img
              src="/images/logoinpire.png"
              alt="Logo"
              className="w-50 h-10 object-contain cursor-pointer"
            />
        </div>
        </nav>
    </>
  );
}
