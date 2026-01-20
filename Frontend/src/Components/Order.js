import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { HiDotsHorizontal } from "react-icons/hi";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEdit, MdWarning } from "react-icons/md";
import img from './Img/com.png'
import { Fragment } from "react";
import { FaTrash } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { CancelOrder, CreateManShip, CreateOrderCheck, GetAllOrder } from '../store/slices/orderSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
const BaseUrl = "http://localhost:5000/api"


const Order = () => {

  const [open, setOpen] = useState(false);
  const [off, setOff] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const dropdownRef = useRef(null);
  const dispatch = useDispatch()
  const orderMap = useSelector(state => state?.orders?.orders.data)
  const loading = useSelector((state) => state.orders.loading);
  const [orderId, setOrderId] = useState(null)

  const navigate = useNavigate()
  const [check, setCheck] = useState({})
  const [orderData, setOrderData] = useState("")

  useEffect(()=>{
     dispatch(GetAllOrder())
  },[])

  useLayoutEffect(() => {
    const handleToken = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/getToken`);
          const token = response?.data?.data;      
        if (token) {
          localStorage.setItem("Token", token);
        }
  
      } catch (error) {
        console.error("Token fetch failed:", error);
      }
    };
  
    handleToken();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return "-";
  
    // "19 Jan 2026, 10:02 AM"
    const [datePart] = dateStr.split(","); // "19 Jan 2026"
  
    return datePart;
  }
  
  console.log("KOKOKOOK" , orderMap);
  
  
  const ShipManage = (ele) => {
    const pincode = ele?.customer_pincode;
    const weight = ele?.shipments?.[0]?.weight; 
    setOrderData(ele) 

    console.log("OREDERRR" , ele);
    
  
    dispatch(CreateOrderCheck({ pincode, weight }))
      .then((value) => {
        console.log("Response:", value);
        setCheck(value?.payload?.data)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  
  const handleManShip = async (id) => {
    try {
      const orderId = orderData?.channel_order_id;  
      await dispatch(CreateManShip({ orderId, id })).unwrap();
      setOff(false)
  
    } catch (error) {
      alert(
        error?.error ||
        error?.message ||
        "Something went wrong"
      );
      setOff(false)

    }
  };
  
  const handleCancelOrder = async () => {
    try {
      await dispatch(CancelOrder(orderId)).unwrap();
      alert("Order Cancelled Successfully");
      setNewOpen(false)
      dispatch(GetAllOrder())
    } catch (error) {
      alert("Failed to cancel order");
      console.error(error);
    }
  };
  

  return (
       <div className='container ms:px-6 mx-auto'>
           <div className='flex justify-between my-2'>
             <h1 className='text-3xl font-bold'>Orders</h1>
             {/* <button onClick={()=> navigate("addorder")} className='px-3 py-2 bg-purple-500 text-white font-[500] rounded hover:bg-purple-600 transition-colors duration-200'>+ Add Order</button> */}
           </div>
           <div className="rounded-xl ds_wraper mt-5 border border-gray-200 shadow-sm bg-white ">
             <table className="w-full ds_manage text-sm text-left text-gray-600 ">
           
               <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0 z-10 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                 <tr>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Order Details</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Customer</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Product</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Package</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Payment</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Pickup Address</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap">Status</th>
                   <th className="px-6 py-4 font-bold text-[14px] whitespace-nowrap text-center">Action</th>
                 </tr>
               </thead>
           
                {loading ? (<tr>
                   <td colSpan="7" className="text-center py-12 text-gray-400">
                     Loading...
                   </td>
                 </tr>
              ) : (
               <tbody className="divide-y divide-gray-200">

                  {orderMap?.map((ele)=>{
                     return(
                           <tr key={ele?._id} className="hover:bg-gray-50 transition">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="font-medium text-gray-900">{ele?.orderId}</div>
                             <div className="text-xs text-gray-500">{formatDate(ele?.created_at)}</div>
                           </td>
                   
                           <td className="px-6 py-4">
                             <div className="font-medium text-gray-900">{ele?.customer_name}</div>
                             <div className="text-xs text-gray-500">{ele?.customer_email}</div>
                           </td>
                   
                           <td className="px-6 py-4">
                              {ele?.products?.map((ele)=>{
                                 return (
                                     <div key={ele?._id}>{ele?.name} </div>
                                 )
                              })}
                           </td>
                   
                           <td className="px-6 py-4">
                             {ele?.others?.weight}kg • Box
                           </td>
                   
                           <td className="px-6 py-4 font-semibold text-green-600">
                             ₹{ele?.total}
                           </td>
                   
                           <td className="px-6 py-4">
                              {ele?.pickup_address_detail?.city || ele?.pickup_address_detail?.state ? (ele?.pickup_address_detail?.city, ele?.pickup_address_detail?.state) : ("-")}
                           </td>
                   
                           <td className="px-6 py-4">
                             <span className={`px-3 whitespace-nowrap ${ele.status === "NEW" ? "bg-blue-100 text-blue-700" : ""} ${ele.status === "RETURN PENDING" ? "bg-yellow-100 text-yellow-700" : ""} ${ele.status === "SUCCESS" ? "bg-green-100 text-green-700" : ""} ${ele.status === "RETURN CANCELLED" ? "bg-red-100 text-red-700" : ""}  ${ele.status === "CANCELED" ? "bg-red-200 text-red-800" : ""}  py-1 text-xs rounded-full  font-medium`}>
                               {ele?.status}
                             </span>
                           </td>
                   
                           <td className="px-6 py-4 text-center">
                               <div className='flex items-center'>
                                 <button onClick={()=> {setOff(true); ShipManage(ele)}} className="px-2 py-1 bg-purple-500 text-white font-[500] rounded whitespace-nowrap text-sm mr-3 hover:bg-purple-600 transition-colors duration-200">
                                  Ship Now
                                 </button>
                                  {(ele.status === "NEW" || ele.status === "RETURN PENDING") && (
                                    <button onClick={()=> {setNewOpen(true); setOrderId(ele?.channel_order_id)}} className="bg-red-500 px-2 py-1 hover:bg-red-600 rounded text-white hover:underline">
                                      Cancel Order
                                    </button>
                                   )}

                                 {/* <div className="relative inline-block" ref={dropdownRef}>
                                  <button
                                    onClick={() => setOpen(!open)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition"
                                  >
                                    <HiDotsHorizontal className="text-lg text-gray-600" />
                                  </button>
                            
                                  {open && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                      
                                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center" onClick={() => {   setOpen(false);  }}>
                                        <MdModeEdit className='me-2 text-[16px] text-green-500' /> Edit Order
                                      </button>
                            
                                      <button className="w-full text-left px-4 py-2 text-sm  hover:bg-red-50 transition flex items-center" onClick={() => {   setOpen(false);   console.log("Cancel Order"); }}>
                                        <FaTrash className='me-2 text-[16px] text-red-500' /> Cancel Order
                                      </button>
                            
                                    </div>
                                   )}
                                 </div> */}
                               </div>
                           </td>
                        </tr>
                     )
                  })}
           
           
               </tbody>
               )} 
             </table>
              
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
                                        <div className='2xl:w-1/5 lg:w-1/3 w-full
               '>
                                           <div className='bg-gray-200 px-4 py-3 h-full'>
                                              <h3 className="font-[500] text-[18px]">Order Details</h3>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Pickup From</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 border-black border-dashed inline'>{orderData?.pickup_address_detail?.pin_code || orderData?.pickup_address_detail?.state ? (orderData?.pickup_address_detail?.pin_code , orderData?.pickup_address_detail?.state) : ("-")} </p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Deliver To</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 border-black border-dashed inline'>{orderData?.customer_pincode || orderData?.customer_state ? (orderData?.customer_pincode, orderData?.customer_state) : ("-") } </p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Order Value</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2  inline'>₹ {orderData?.total || "-"}</p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Payment Mode</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2  inline'>{orderData?.payment_method || "-"}</p>
                                              </div>
                                              <div className='mt-4'>
                                                 <p className='text-[12px] text-muted text-[#888] font-[500]'>Applicable Weight (in Kg)</p>
                                                 <p className='text-[12px] text-muted  font-[500] mt-1 border-b-2 inline'>{orderData?.shipments?.[0]?.weight || "-"} Kg</p>
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
                                               
                                                     {check?.available_courier_companies?.map((ele)=>{
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
                                                               Tomorrow
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
                                                                   <button onClick={()=> {setOff(true); handleManShip(ele?.courier_company_id)}} className="px-2 py-1 bg-purple-500 text-white font-[500] whitespace-nowrap rounded text-sm mr-3">
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

           <Dialog open={newOpen} onClose={setNewOpen} className="relative z-[100]">
           <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-center items-center flex-col">
                    <MdWarning aria-hidden="true" className="size-10 text-red-400" />
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="mt-4">
                      <p className="text-xl font-medium text-gray-400 ">
                      Are you sure you want to cancel this order?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 pt-4 sm:flex sm:flex-row-reverse items-center justify-center sm:gap-3 sm:px-6 pb-8">
                 <button
                   type="button"
                   onClick={() => handleCancelOrder()}
                   className="w-full sm:w-32 h-10 inline-flex items-center justify-center rounded-md bg-red-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                 >
                   Yes, Cancel
                 </button>
               
                 <button
                   type="button"
                   onClick={() => setNewOpen(false)}
                   className="w-full sm:w-32 h-10 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                 >
                   No
                 </button>
               </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
       </div>
  )
}

export default Order