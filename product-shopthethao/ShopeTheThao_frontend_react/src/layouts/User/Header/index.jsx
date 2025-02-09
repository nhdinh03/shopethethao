import React, { useState } from "react";
import { ChevronDown, Menu, ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <span className="bg-white text-blue-600 px-2 py-1 rounded">SPORT</span> SHOP
        </div>

        {/* Menu chính */}
        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">Features</a>
          <a href="#" className="hover:text-blue-400">Marketplace</a>

          {/* Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="flex items-center gap-1 hover:text-blue-400">
              Company <ChevronDown size={16} />
            </button>
            {isOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 shadow-lg rounded-lg">
                <ul className="p-2 space-y-2">
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Audience</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Marketing Automation</li>
                  <li className="relative group">
                    <button 
                      onClick={() => setSubMenuOpen(!subMenuOpen)} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between">
                      Creative Tools <ChevronDown size={14} />
                    </button>
                    {subMenuOpen && (
                      <ul className="absolute left-full top-0 ml-2 w-48 bg-gray-800 shadow-lg rounded-lg">
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Marketing CRM</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Sign up forms</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Segmentation</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Dynamic content</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">A/B Testing</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-blue-400">Behavioural targeting</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Integrations</li>
                      </ul>
                    )}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Insights & Analytics</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Demographics</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Contact Profiles</li>
                </ul>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-blue-400">Team</a>
          <a href="#" className="hover:text-blue-400">Contact</a>
        </nav>

        {/* Thanh tìm kiếm + Giỏ hàng + Tài khoản */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative cursor-pointer">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">3</span>
          </div>
          <User size={24} className="cursor-pointer" />
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">Login</button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg">Sign Up</button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Menu size={24} className="cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;
