import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
        <div className="w-1/6">
           <Sidebar open={open} setOpen={setOpen} />
        </div>

      {/* Main Content */}
      <div className="w-5/6">
        {/* Header */}
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;


// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import { FiMenu } from "react-icons/fi";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";

// const Layout = ({ children }) => {
//   const [open, setOpen] = useState(false);

//   return (

//       <div className="w-full">
//         {/* Header */}
//        <Header/>
//         <Outlet/>
//       </div>
//   );
// };

// export default Layout;
