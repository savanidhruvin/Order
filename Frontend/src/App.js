import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Order from "./Components/Order";
import AddOrder from "./Components/AddOrder";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/addorder" element={<AddOrder />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
