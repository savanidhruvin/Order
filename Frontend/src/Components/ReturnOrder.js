import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { GetAllReturnOrders } from "../store/slices/returnorderSlice";

const OrderReturnPage = () => {
  const dispatch = useDispatch();
  const returnOrders = useSelector((state) => state.returnOrders.returnOrders || []);
  const loading = useSelector((state) => state.returnOrders.loading);

  useEffect(() => {
    dispatch(GetAllReturnOrders());
  }, [dispatch]);
  return (
    <div className="w-full px-6 py-5">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-5 ml-4">
        <h1 className="text-[26px] font-bold text-black">
          Return Orders
        </h1>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden ml-5">

        {/* Scroll wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse text-sm text-gray-700">

            {/* Table Header */}
            <thead className="bg-[#fafafa] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Return Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Buyer Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Product Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Dimensions
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Warehouse Address
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase">
                  Refund Details
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : returnOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No return orders found
                  </td>
                </tr>
              ) : (
                returnOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{order._id}</div>
                      <div className="text-xs text-gray-500">Shipment: {order.returnShipmentId || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</div>
                      <div className="text-xs text-gray-500">{order.shippingInfo?.phone}</div>
                      <div className="text-xs text-gray-500">{order.shippingInfo?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="text-sm text-gray-700">{it.name} x {it.qty}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{order.dimension?.length || 0} x {order.dimension?.breadth || 0} x {order.dimension?.height || 0}</div>
                      <div className="text-xs text-gray-500">Weight: {order.dimension?.weight || 0}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{order.shippingInfo?.address}</div>
                      <div className="text-xs text-gray-500">{order.shippingInfo?.city}, {order.shippingInfo?.state}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">₹{order.subTotal}</div>
                      <div className="text-xs text-gray-500">Status: {order.returnStatus || order.status}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-3 py-2 bg-blue-500 text-white rounded whitespace-nowrap">Initiate Return</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderReturnPage;
