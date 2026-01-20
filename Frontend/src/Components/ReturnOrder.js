import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { GetAllReturnOrders, ReturnOrder, ReturnOrderCheck, ReturnOrderManPart } from "../store/slices/returnorderSlice";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { MdWarning } from 'react-icons/md';
import { Fragment } from "react";
import img from './Img/com.png'
import { useFormik } from "formik";
import { ReturnValidation } from "../Schema";

const OrderReturnPage = () => {
  const dispatch = useDispatch();
  const returnOrders = useSelector((state) => state.returnOrders.returnOrders || []);
  const loading = useSelector((state) => state.returnOrders.loading);
  const [returnCheck, setReturnCheck] = useState("")
  const [returnData, setReturnData] = useState("")
  const [off, setOff] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelOrder, setCancelOrder] = useState(null)
  const [newOpen, setNewOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelRemark, setCancelRemark] = useState("")
  const [orderId, setOrderId] = useState(null)

  const cancelReasons = [
    "Customer changed mind",
    "Ordered by mistake",
    "Found cheaper elsewhere",
    "Shipping time too long",
    "Other",
  ];

  useEffect(() => {
    dispatch(GetAllReturnOrders());
  }, []);

  // console.log("JJJJJJ" , returnOrders);
  

  const ReturnManage = (ele) => {
    
    const pincode = ele?.shippingInfo?.pincode;
    const weight = ele?.dimension?.weight; 
    setReturnData(ele)     
  
    dispatch(ReturnOrderCheck({ pincode, weight }))
      .then((value) => {
        console.log("Response:", value);
        setReturnCheck(value?.payload?.data)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const openCancel = (order) => {
    setCancelOrder(order);
    setCancelReason("");
    setCancelRemark("");
    setNewOpen(true);
  };



  const handleManShip = async (id) => {
    try {
      const channelOrderId = returnData?.raw?.channel_order_id;
      let orderId = channelOrderId?.replace(/^RET-/, "");
      // console.log("KKKKKKK", orderId);
      
      await dispatch(ReturnOrderManPart({ orderId, id })).unwrap();
      setOff(false);
    } catch (error) {
      alert(
        error?.error?.message ||
        error?.message ||
        "Something went wrong"
      );
      setOff(false);
    }
    
  };

  const returnVal = {
      reason:""
  }
  const ReturnOrderFormik = useFormik({
    initialValues: returnVal,
    validationSchema: ReturnValidation,
    onSubmit: (values, action) => {
      const orderID = orderId.replace(/^RET-/, "");
  
      dispatch(ReturnOrder({ values, orderID }))
        .unwrap()
        .then(() => {
          alert("Return order submitted successfully");
          action.resetForm();
          setNewOpen(false); 
        })
        .catch((err) => {
          alert(err?.message || "Failed to submit return request");
        });
    }
  });
  
  
  return (
    <div className="container ms:px-6 mx-auto">

      {/* Page Header */}
      <div className="flex justify-between items-center my-2">
        <h1 className="text-3xl font-bold">
          Return Orders
        </h1>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl mt-5 border border-gray-200 overflow-hidden ">

        {/* Scroll wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse text-sm text-gray-700">

            {/* Table Header */}
            <thead className="bg-[#fafafa] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Return Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Buyer Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Product Details
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Dimensions
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Warehouse Address
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Refund Details
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase whitespace-nowrap">
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
                        <div className="flex items-center justify-center gap-2">
                        <button onClick={()=> {setOff(true); ReturnManage(order)}} className="px-3 py-2 bg-purple-500 text-white font-[500] rounded whitespace-nowrap">Initiate Return</button>
                        <button onClick={()=> {setOrderId(order?.raw?.channel_order_id); setNewOpen(true)}} className="bg-red-500 px-2 py-2 hover:bg-red-600 rounded text-white whitespace-nowrap hover:underline">Cancel Order</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

              <Transition show={off} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={setOff}>
                  
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-900/50" />
                  </Transition.Child>
              
                  <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              
                        <Transition.Child
                          as={Fragment}
                          enter="transform transition ease-in-out duration-500"
                          enterFrom="translate-x-full"
                          enterTo="translate-x-0"
                          leave="transform transition ease-in-out duration-500"
                          leaveFrom="translate-x-0"
                          leaveTo="translate-x-full"
                        >
                          <DialogPanel
                            className="pointer-events-auto relative w-[290px] sm:w-[400px] lg:w-[750px] 2xl:w-[1200px] 3xl:w-[1700px] bg-white shadow-xl flex flex-col"
                          >
                            <div className="relative flex h-full flex-col overflow-y-auto">
              
                             
              
                              <div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                                <div className="relative  flex-1 px-4 sm:px-6">
                                    <div className='flex lg:flex-nowrap lg:flex-row flex-col-reverse lg:h-full'>
                                        <div className='2xl:w-1/5 lg:w-1/3 w-full'>
                                           <div className='bg-gray-200 px-4 py-3 h-full'>
                                              <h3 className="font-[500] text-[18px]">Order Details</h3>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Pickup From</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 border-black border-dashed inline'>{returnData?.raw?.customer_pincode || returnData?.raw?.customer_state ? (returnData?.raw?.customer_pincode , returnData?.raw?.customer_state) : ("-")} </p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Deliver To</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 border-black border-dashed inline'>{returnData?.raw?.return_pickup_data?.pin_code  || returnData?.raw?.return_pickup_data?.country ? (returnData?.raw?.return_pickup_data?.pin_code, returnData?.raw?.return_pickup_data?.country) : ("-") } </p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Order Value</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2  inline'>₹ {returnData?.subTotal || "-"}</p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Payment Mode</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2  inline'>{returnData?.raw?.payment_method || "-"}</p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Applicable Weight (in Kg)</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 inline'>{returnData?.dimension?.weight || "-"} Kg</p>
                                              </div>
                                           </div>
                                        </div>
                                        <div className="2xl:w-4/5 lg:w-2/3 w-full">
                                           <div className='bg-[#f8f8f8] h-full px-4 py-3'>
                                              <div className='flex justify-between items-center'>
                                                 <h3 className='font-[500] text-[18px]'>Select Courier Partner</h3>
                                                 <IoCloseSharp className='text-[22px] cursor-pointer' onClick={()=> setOff(false)} />
                                              </div>
                                              <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white mt-5">
                                                 <table className="w-full text-sm text-left text-gray-600">
                                               
                                                   <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0 z-10 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                                                     <tr>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Courier Partner</th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Rating</th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Expected Pickup</th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Estimated Delivery</th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Chargeable Weight </th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Charges</th>
                                                       <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Action</th>
                                                     </tr>
                                                   </thead>
                                               
                                                   <tbody className="divide-y divide-gray-200">
                                               
                                                     {returnCheck?.available_courier_companies?.map((ele)=>{
                                                        return (
                                                          <tr className="hover:bg-gray-50 transition">
                                                             <td className="px-6 py-4 whitespace-nowrap">
                                                               <div className='flex items-center'>
                                                                 <img src={img} alt="" className='w-12 me-2' />
                                                                 <div>
                                                                   <div className="font-medium text-gray-900">{ele?.courier_name }</div>
                                                                   <div className="text-xs text-gray-500">{ele?.id}</div>
                                                                 </div>
                                                               </div>
                                                             </td>
                                                     
                                                             <td className="px-6 py-4">
                                                                {ele?.rating}
                                                             </td>
                                                     
                                                             <td className="px-6 py-4">
                                                               {ele?.suppress_date}
                                                             </td>
                                                     
                                                             <td className="px-6 py-4">
                                                               {ele?.etd}
                                                             </td>
                                                     
                                                             <td className="px-6 py-4 font-semibold text-green-600">
                                                               {ele?.charge_weight} Kg
                                                             </td>
                                                     
                                                             <td className="px-6 py-4">
                                                                <div className='text-[16px] font-bold'>₹{ele?.rate}</div>
                                                             </td>
                                                     
                                                     
                                                             <td className="px-6 py-4 text-center">
                                                                 <div className='flex items-center'>
                                                                   <button onClick={()=> {setOff(true) ; handleManShip(ele?.courier_company_id)}} className="px-2 py-1 bg-purple-500 text-white font-[500] whitespace-nowrap rounded text-sm mr-3">
                                                                    Ship Now
                                                                   </button>
                                                                 </div>
                                                             </td>
                                                          </tr>
                                                        )
                                                     })}
                                               
                                                   </tbody>
                                                 </table>
                                               </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
              
                            </div>
                          </DialogPanel>
                        </Transition.Child>
             
                     </div>
                   </div>
                 </div>
               </Dialog>
              </Transition>
              
              <Transition show={newOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[99]" onClose={() => setNewOpen(false)}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black/40" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                          <div className="flex flex-col items-center gap-4 ">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                              <MdWarning className="text-red-600 text-3xl" />
                            </div>
                            <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 text-center">
                              Are you sure you want to cancel this order?
                            </Dialog.Title>
                            <form onSubmit={ReturnOrderFormik.handleSubmit} className="w-full">
                            <div className="w-full">
                              <label className="sr-only">Reason</label>
                              <textarea
                                name="reason"
                                value={ReturnOrderFormik.values.reason}
                                onChange={ReturnOrderFormik.handleChange}
                                onBlur={ReturnOrderFormik.handleBlur}
                                placeholder="Enter reason to cancel"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-none h-20"
                              />
                              {ReturnOrderFormik.touched.reason &&ReturnOrderFormik.errors.reason && (  <p className="text-xs text-red-500 mt-1">    {ReturnOrderFormik.errors.reason}  </p>)}
                            </div>

                            <div className="mt-5 w-full flex justify-center gap-3">
                              <button
                                type="button"
                                className="w-full sm:w-32 h-10 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={() => setNewOpen(false)}
                              >
                                Cancel
                              </button>
                              <div className="inline">
                                <button
                                  type="submit"
                                  className="w-full sm:w-32 h-10 inline-flex items-center justify-center rounded-md bg-red-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                  Yes, Cancel
                                </button>
                              </div>
                            </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
    </div>
  );
};

export default OrderReturnPage;
