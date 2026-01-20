import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const menu = [
    { name: "Order", icon: <FiHome />, path: "/" },
    { name: "Add Order", icon: <FiShoppingBag />, path: "/addorder" },
    { name: "Return Order", icon: <FiUsers />, path: "/returnorder" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <h1 className="font-bold text-lg">My App</h1>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                transition
                ${
                  active === item.path
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
