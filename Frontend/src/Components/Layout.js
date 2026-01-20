import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
       <Header/>
        <Outlet/>
      </div>
    </div>
  );
};

export default Layout;
