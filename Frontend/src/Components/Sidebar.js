import React, { useState } from "react";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = ({open , setOpen}) => {
  

  const menu = [
    { name: "Order", icon: <FiHome />, path: "/" },
    { name: "Add Order", icon: <FiShoppingBag />, path: "/addorder" },
    { name: "Return Order", icon: <FiUsers />, path: "/customers" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
  ];

  return (
    <>
      {/* <div className="hidden flex items-center justify-between p-4 border-b bg-white">
        <h1 className="font-semibold text-lg">My App</h1>
        <button onClick={() => setOpen(true)}>
          <FiMenu className="text-xl" />
        </button>
      </div> */}

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">My App</h2>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="hidden lg:block w-64"></div>
    </>
  );
};

export default Sidebar;
