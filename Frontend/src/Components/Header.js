import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate()

    return (
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-[99]">
        {/* Top Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left Section */}
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage and track all your orders here
            </p>
          </div>
  
          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            

  
            {/* Add Order */}
            <button onClick={()=> navigate("addorder")} className="bg-purple-500  text-white hover:bg-purple-600  text-sm font-medium px-4 py-2 rounded-md">
              + Add Order
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  
export default Header
