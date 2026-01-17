import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Order from "./Components/Order";
import AddOrder from "./Components/AddOrder";
import AddOrder2 from "./Components/AddOrder2";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/order2" element={<AddOrder2 />} />
        <Route path="/addorder" element={<AddOrder />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
