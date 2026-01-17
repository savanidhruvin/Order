import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Order from "./Components/Order";
import AddOrder from "./Components/AddOrder";
import AddOrder2 from "./Components/AddOrder2";
import Layout from "./Components/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>} >
           <Route index element={<Order />} />
           <Route path="/addorder" element={<AddOrder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
