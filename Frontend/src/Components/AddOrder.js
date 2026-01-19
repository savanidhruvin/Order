import React, { useState, useEffect, Fragment, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaLessThan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";

import { useDispatch, useSelector } from 'react-redux';
import { GetPickupAddresses } from '../store/slices/pickupaddressSlice';
import { useFormik } from 'formik';
import { OrderSchema } from '../Schema';
import { CreateOrder } from '../store/slices/orderSlice';

const AddOrder = () => {
  const dispatch = useDispatch();
  const { pickupAddresses, loading, message } = useSelector(state => state.pickupAddresses);

  useEffect(() => {
    dispatch(GetPickupAddresses());
  }, [dispatch]);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [primaryAddressId, setPrimaryAddressId] = useState(null);
  const addressesRef = useRef(null);

  const toggleMenu = (id, e) => {
    e && e.stopPropagation();
    const btn = e && e.currentTarget;
    if (!btn) {
      setOpenMenuId(prev => (prev === id ? null : id));
      setMenuPosition(null);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const nextId = openMenuId === id ? null : id;
    setOpenMenuId(nextId);
    setMenuPosition(nextId ? { top: rect.bottom, left: rect.left, width: rect.width } : null);
  };

  // Close the open menu when clicking anywhere outside the menu/button
  useEffect(() => {
    const handleDocumentClick = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [openMenuId]);

  const markAsPrimary = (address) => {
    setPrimaryAddressId(address.id);
    setOpenMenuId(null);

    // Open Shiprocket pickup addresses page and pass address details via query params (best-effort prefill)
    const params = new URLSearchParams({
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pin_code ?? address.pincode ?? "",
      name: address.contact_name || address.name || "",
      phone: address.mobile || address.phone || ""
    }).toString();

    const shiprocketUrl = `https://app.shiprocket.in/sellers/settings/company-setup/pickup-addresses?${params}`;

    window.open(shiprocketUrl, "_blank", "noopener,noreferrer");
  };

  const [products, setProducts] = useState([
    {
      id: Date.now(),
      productName: '',
      unitPrice: '',
      quantity: 1,
      discount: '',
      taxRate: ''
    }
  ]);

  const [subTotals, setSubTotals] = useState(0);


  const addProduct = () => {
    const products = [...AddFormik.values.products];
  
    products.push({
      productName: "",
      unitPrice: "",
      quantity: 1,
      discount: "",
      taxRate: "",
    });
  
    AddFormik.setFieldValue("products", products);
  };
  

  const deleteProduct = (index) => {
    if (AddFormik.values.products.length === 1) return;
  
    const products = AddFormik.values.products.filter(
      (_, i) => i !== index
    );
  
    AddFormik.setFieldValue("products", products);
  };
  

  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const updateQuantity = (index, type) => {
    const products = [...AddFormik.values.products];
  
    products[index].quantity =
      type === "inc"
        ? products[index].quantity + 1
        : Math.max(1, products[index].quantity - 1);
  
    AddFormik.setFieldValue("products", products);
  };

  const getVolumetricWeight = (length, breadth, height) => {
    if (!length || !breadth || !height) return "";
    return ((length * breadth * height) / 5000).toFixed(2);
  };
  
  const calculateTotals = (products) => {
    let subTotal = 0;
  
    products.forEach((item) => {
      const price = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 0;
      const discount = Number(item.discount) || 0;
      const taxRate = Number(item.taxRate) || 0;
  
      const baseAmount = price * qty - discount;
      const taxAmount = (baseAmount * taxRate) / 100;
  
      subTotal += baseAmount + taxAmount;
    });
  
    return {
      subTotal,
      total: subTotal, 
    };
  };

  const initialValues = {
    mobile: "",
    firstName: "",
    lastName: "",
    email:"",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country:"",
  
    products: [
      {
        productName: "",
        unitPrice: "",
        quantity: 1,
        discount: "",
        taxRate: "",
      },
    ],
  
    deadWeight: "",
    length: "",
    breadth: "",
    height: "",
  };

  const AddFormik = useFormik({
      initialValues: initialValues,
      validationSchema:OrderSchema,
      onSubmit : (values , action) => {
           console.log("OKOKOKO" , values);
           dispatch(CreateOrder({values , subTotals}))
      }
  })

  useEffect(() => {
    const totals = calculateTotals(AddFormik.values.products);
    setSubTotals(totals.subTotal);
  }, [AddFormik.values.products]);
  
  const { subTotal, total } = calculateTotals(AddFormik.values.products);

  return (
    <>
  <div className="container ms:px-10 px-5 mx-auto mt-5">
    <div className="flex items-center justify-between gap-2 text-gray-900">
      <h1 className="text-2xl font-bold">Add Order</h1>
      <button className='px-2 py-1 bg-purple-500 text-white font-[500] rounded hover:bg-purple-600 transition-colors duration-200'>Back</button>
    </div>
    {/* <div className="mt-6 border-b border-gray-200">
      <div className="flex gap-6 text-sm font-medium">
        <button className="relative pb-3 text-purple-600">Domestic Order
          <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-purple-600 rounded"></span>
        </button>
        <button className="pb-3 text-gray-400 hover:text-gray-600">International Order</button>
      </div>
    </div> */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 mt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs sm:text-sm">Pickup Address</h3>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setOpenModal(true)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm sm:text-base"><LuPlus /></button>
          </div>
        </div>

        <div ref={addressesRef} className="mt-4 border rounded-md px-4 py-4 bg-white relative">
          {loading ? (
            <span className="text-sm font-medium text-gray-500">Loading...</span>
          ) : pickupAddresses && pickupAddresses.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5
              ${pickupAddresses.length > 3 ? 'max-h-96 overflow-y-auto pr-1' : ''}`}
            >
              {pickupAddresses.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-xl p-4 cursor-pointer transition
                  bg-white border
                  ${primaryAddressId === p.id ? "border-purple-500 ring-1 ring-purple-300" : "border-gray-200"}
                  hover:border-purple-500 hover:shadow-md`}
                >

                  {/* 3 dots button */}
                  <button
                    onClick={(e) => toggleMenu(p.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full
                    hover:bg-gray-100 text-gray-500"
                  >
                    ⋯
                  </button>

                  {/* Dropdown menu rendered to body to avoid expanding scroll container */}
                  {openMenuId === p.id && menuPosition && createPortal(
                    <div
                      style={
                        addressesRef.current
                          ? {
                              position: 'absolute',
                              top: menuPosition.top - addressesRef.current.getBoundingClientRect().top + addressesRef.current.scrollTop + 8,
                              left: menuPosition.left - addressesRef.current.getBoundingClientRect().left + addressesRef.current.scrollLeft - 192 + menuPosition.width,
                              width: 192
                            }
                          : {
                              position: 'fixed',
                              top: menuPosition.top + window.scrollY + 8,
                              left: menuPosition.left + window.scrollX - 192 + menuPosition.width,
                              width: 192
                            }
                      }
                      className={`${addressesRef.current ? '' : 'fixed'} bg-white border rounded-lg shadow-lg z-50`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsPrimary(p);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                      >
                        Mark as Primary Address
                      </button>
                    </div>,
                    addressesRef.current || document.body
                  )}

                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {p.address}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {p.city}, {p.state} - {p.pin_code ?? p.pincode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-400">
              No pickup addresses found
            </span>
          )}
        </div>
      </div>
      
      <form onSubmit={AddFormik.handleSubmit}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="font-semibold text-xs sm:text-sm mb-1">Delivery Details</h3>
        <p className="text-xs text-gray-500 mb-4 sm:mb-5">Enter the Delivery Details of your buyer for whom you are making this order</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs text-gray-600">Mobile Number</label>
            <div className="flex mt-1">
              <input name="mobile" value={AddFormik.values.mobile} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="w-full border rounded-r-md px-2 sm:px-3 py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-purple-500" placeholder="Enter mobile number"/>
            </div>
              {AddFormik.touched.mobile && AddFormik.errors.mobile && (<p className="text-red-500 text-xs mt-1">  {AddFormik.errors.mobile}</p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Full Name</label>  
            <input name="firstName" value={AddFormik.values.firstName} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter Full Name"/>
            {AddFormik.touched.firstName && AddFormik.errors.firstName && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.firstName} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Last Name</label>  
            <input name="lastName" value={AddFormik.values.lastName} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter Full Name"/>
            {AddFormik.touched.lastName && AddFormik.errors.lastName && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.lastName} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Email</label>  
            <input name="email" value={AddFormik.values.email} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter Email"/>
            {AddFormik.touched.email && AddFormik.errors.email && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.email} </p>)}
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs text-gray-600">Complete Address</label>
            <input name='address' value={AddFormik.values.address} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter Buyer's full address"/>
            {AddFormik.touched.address && AddFormik.errors.address && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.address} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Landmark <span className="text-gray-400">(Optional)</span></label>
            <input name='landmark' value={AddFormik.values.landmark} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter any nearby landmark"/>
            {AddFormik.touched.landmark && AddFormik.errors.landmark && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.landmark} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Pincode</label>
            <input name='pincode' value={AddFormik.values.pincode} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur}  className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Enter pincode"/>
            {AddFormik.touched.pincode && AddFormik.errors.pincode && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.pincode} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">City</label>
            <input name='city' value={AddFormik.values.city} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50" placeholder="City"/>
            {AddFormik.touched.city && AddFormik.errors.city && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.city} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">State</label>
            <input name='state' value={AddFormik.values.state} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50" placeholder="State"/>
            {AddFormik.touched.state && AddFormik.errors.state && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.state} </p>)}
          </div>

          <div>
            <label className="text-xs text-gray-600">Country</label>
            <input name='country' value={AddFormik.values.country} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50" placeholder="State"/>
            {AddFormik.touched.country && AddFormik.errors.country && ( <p className="text-red-500 text-xs mt-1">   {AddFormik.errors.country} </p>)}
          </div>
        </div>


      </div>

    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Product Details</h3>
        
        {AddFormik.values.products.map((_, index) => (
          <div key={index} className={index > 0 ? "mt-4 sm:mt-6" : ""}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 sm:gap-4 items-end">
                <div className="sm:col-span-2 lg:col-span-2 relative pb-4">
                    <label className="text-xs text-gray-600">Product Name</label>
                  
                    <input
                      className="mt-1 w-full border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm"
                      placeholder="Enter or search your product name"
                      name={`products[${index}].productName`}
                      value={AddFormik.values.products[index].productName}
                      onChange={AddFormik.handleChange}
                      onBlur={AddFormik.handleBlur}
                    />
                  
                    {AddFormik.touched.products?.[index]?.productName &&
                      AddFormik.errors.products?.[index]?.productName && (
                        <p className="absolute left-0 -bottom-1 text-red-500 text-[10px]">
                          {AddFormik.errors.products[index].productName}
                        </p>
                     )}
                </div>
 

                <div className="relative pb-4">
                 <label className="text-xs text-gray-600">Unit Price</label>
               
                 <div className="flex mt-1 h-[38px]">
                   <span className="px-2 sm:px-3 flex items-center border border-r-0 rounded-l-md bg-gray-100 text-xs sm:text-sm">
                     ₹
                   </span>
               
                   <input 
                     className="w-full border rounded-r-md px-2 sm:px-3 text-xs sm:text-sm outline-none"
                     type="number"
                     name={`products[${index}].unitPrice`}
                     value={AddFormik.values.products[index].unitPrice}
                     onChange={AddFormik.handleChange}
                     onBlur={AddFormik.handleBlur}
                   />
                 </div>
               
                 {AddFormik.touched.products?.[index]?.unitPrice &&
                   AddFormik.errors.products?.[index]?.unitPrice && (
                     <p className="absolute left-0 -bottom-1 text-red-500 text-[10px]">
                       {AddFormik.errors.products[index].unitPrice}
                     </p>
                 )}
               </div>


               <div className="relative pb-4">
                  <label className="text-xs text-gray-600">Quantity</label>
                
                  <div className="mt-1 flex border rounded-md overflow-hidden h-[38px]">
                    <button
                      type="button"
                      className="px-2 sm:px-3 bg-gray-100 text-xs sm:text-sm min-w-[36px]"
                      onClick={() => updateQuantity(index, "dec")}
                    >
                      <FiMinus />
                    </button>
                
                    <input 
                      className="w-full text-center text-xs sm:text-sm outline-none"
                      type="number"
                      name={`products[${index}].quantity`}
                      value={AddFormik.values.products[index].quantity}
                      onChange={AddFormik.handleChange}
                      onBlur={AddFormik.handleBlur}
                    />
                
                    <button 
                      type="button"
                      className="px-2 sm:px-3 bg-gray-100 text-xs sm:text-sm min-w-[36px]"
                      onClick={() => updateQuantity(index, "inc")}
                    >
                      <LuPlus />
                    </button>
                  </div>
                
                  {AddFormik.touched.products?.[index]?.quantity &&
                    AddFormik.errors.products?.[index]?.quantity && (
                      <p className="absolute left-0 -bottom-1 text-red-500 text-[10px]">
                        {AddFormik.errors.products[index].quantity}
                      </p>
                  )}
               </div>


               <div className="relative pb-4">
                 <label className="text-xs text-gray-600">
                   Product Discount <span className="text-gray-400">(Optional)</span>
                 </label>
               
                 <div className="flex mt-1 h-[38px]">
                   <span className="px-2 sm:px-3 flex items-center border border-r-0 rounded-l-md bg-gray-100 text-xs sm:text-sm">
                     ₹
                   </span>
               
                   <input 
                     className="w-full border rounded-r-md px-2 sm:px-3 text-xs sm:text-sm outline-none"
                     type="number"
                     name={`products[${index}].discount`}
                     value={AddFormik.values.products[index].discount}
                     onChange={AddFormik.handleChange}
                     onBlur={AddFormik.handleBlur}
                   />
                 </div>
               
                 {AddFormik.touched.products?.[index]?.discount &&
                   AddFormik.errors.products?.[index]?.discount && (
                     <p className="absolute left-0 -bottom-1 text-red-500 text-[10px]">
                       {AddFormik.errors.products[index].discount}
                     </p>
                 )}
                </div>


                <div className="sm:col-span-2 lg:col-span-1 relative pb-4">
                   <div className="flex items-end gap-2">
                     
                     <div className="flex-1">
                       <label className="text-xs text-gray-600">
                         Tax Rate <span className="text-gray-400">(Optional)</span>
                       </label>
                 
                       <div className="flex mt-1 h-[38px]">
                         <span className="px-2 sm:px-3 flex items-center border border-r-0 rounded-l-md bg-gray-100 text-xs sm:text-sm">
                           %
                         </span>
                 
                         <input 
                           className="w-full border rounded-r-md px-2 sm:px-3 text-xs sm:text-sm outline-none"
                           type="number"
                           name={`products[${index}].taxRate`}
                           value={AddFormik.values.products[index].taxRate}
                           onChange={AddFormik.handleChange}
                           onBlur={AddFormik.handleBlur}
                         />
                       </div>
                     </div>
                 
                     <button
                       type="button"
                       className="text-red-500 text-base sm:text-lg p-1 sm:p-2 mb-[2px]"
                       onClick={() => deleteProduct(index)}
                       disabled={AddFormik.values.products.length === 1}
                     >
                       <RiDeleteBin6Line />
                     </button>
                   </div>
                 
                   {AddFormik.touched.products?.[index]?.taxRate &&
                     AddFormik.errors.products?.[index]?.taxRate && (
                       <p className="absolute left-0 -bottom-1 text-red-500 text-[10px]">
                         {AddFormik.errors.products[index].taxRate}
                       </p>
                   )}
                  </div>
            </div>
          </div>
        ))}

       <button
         type="button"
         className="mt-4 text-xs sm:text-sm text-purple-600 border border-purple-300 px-3 sm:px-4 py-1.5 rounded-md"
         onClick={addProduct}
       >
         + Add Another Product
       </button>


     

       <div className="mt-4 sm:mt-6 bg-blue-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm">
         <div className="flex justify-between mb-2">
           <span>Sub-total for Product</span>
           <span>₹ {subTotal.toFixed(2)}</span>
         </div>
       
         <div className="flex justify-between mb-2">
           <span>Other Charges</span>
           <span>₹ 0</span>
         </div>
       
         <div className="flex justify-between font-semibold">
           <span>Total Order Value</span>
           <span>₹ {total.toFixed(2)}</span>
         </div>
      </div>


        <p className="mt-2 text-xs text-gray-500">Note: All the Prices/ Charges are inclusive of GST.</p>
      </div>
  
    </div>

    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold">Package Details</h3>
            <p className="text-xs text-gray-500 mt-1">Provide the details of the final package that includes all the ordered items packed together.</p>
          </div>
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shrink-0"><HiOutlineLightBulb className='text-lg'/>Tip: Add correct values to avoid weight discrepancy</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            <label className="text-xs font-medium">Dead Weight</label>
            <p className="text-xs text-gray-500 mb-1">Physical weight of a package</p>
            <div className="flex">
              <input name="deadWeight" value={AddFormik.values.deadWeight} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="w-full border rounded-l-md px-2 sm:px-3 py-2 text-xs sm:text-sm" />
              <span className="px-2 sm:px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-xs sm:text-sm">kg</span>
            </div>
            {AddFormik.touched.deadWeight && AddFormik.errors.deadWeight && (<p className="text-red-500 text-xs mt-1">  {AddFormik.errors.deadWeight}</p>)}
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">Note: Minimum chargeable wt is 0.5 kg</p>
          </div>

          <div className="lg:col-span-6">
            <label className="text-xs font-medium">Package Dimensions</label>
            <p className="text-xs text-gray-500 mb-1">L×B×H of the complete package</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <div className="flex">
                  <input name="length" value={AddFormik.values.length} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="w-full border rounded-l-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Length" />
                  <span className="px-2 sm:px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-xs sm:text-sm">cm</span>
                </div>
                 {AddFormik.touched.length && AddFormik.errors.length && (<p className="text-red-500 text-xs mt-1">  {AddFormik.errors.length}</p>)}
              </div>
              <div>
                 <div className="flex">
                   <input  name="breadth" value={AddFormik.values.breadth} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="w-full border rounded-l-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Breadth" />
                   <span className="px-2 sm:px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-xs sm:text-sm">cm</span>
                 </div>
                 {AddFormik.touched.breadth && AddFormik.errors.breadth && (<p className="text-red-500 text-xs mt-1">  {AddFormik.errors.breadth}</p>)}
              </div>
              <div>
                 <div className="flex">
                   <input name="height" value={AddFormik.values.height} onChange={AddFormik.handleChange} onBlur={AddFormik.handleBlur} className="w-full border rounded-l-md px-2 sm:px-3 py-2 text-xs sm:text-sm" placeholder="Height" />
                   <span className="px-2 sm:px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-xs sm:text-sm">cm</span>
                 </div>
                 {AddFormik.touched.height && AddFormik.errors.height && (<p className="text-red-500 text-xs mt-1">  {AddFormik.errors.height}</p>)}
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">Note: Value should be greater than 0.50 cm</p>
          </div>

          <div className="lg:col-span-3 sm:mt-3">
            <label className="text-xs font-medium flex items-center gap-1">
              Volumetric Weight
              <span className="text-gray-400">(Auto)</span>
            </label>
          
            <div className="flex mt-1 sm:mt-4">
              <input
                type="text"
                readOnly
                value={getVolumetricWeight(
                  AddFormik.values.length,
                  AddFormik.values.breadth,
                  AddFormik.values.height
                )}
                className="w-full border rounded-l-md px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50 cursor-not-allowed"
                placeholder="Auto calculated"
              />
              <span className="px-2 sm:px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-xs sm:text-sm">
                kg
              </span>
            </div>
          
            {AddFormik.touched.length &&
              AddFormik.touched.breadth &&
              AddFormik.touched.height &&
              (AddFormik.errors.length ||
                AddFormik.errors.breadth ||
                AddFormik.errors.height) && (
                <p className="text-red-500 text-xs mt-1">
                  Enter valid package dimensions
                </p>
              )}
          </div>

        </div>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-500 rounded-md text-xs sm:text-sm font-medium">Ship Now</button>
          <button type='submit' className="px-4 sm:px-6 py-2 sm:py-3 bg-white border border-purple-600 text-purple-600 rounded-md text-xs sm:text-sm font-medium">Add Order</button>
        </div>
      </div>
    </div>
    </form>
  </div>

  {/* Modal for Add New Pickup Address */}
  <Transition show={openModal} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
      <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-gray-900/50" />
      </Transition.Child>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <DialogPanel className="pointer-events-auto relative w-full max-w-8xl bg-white shadow-xl flex flex-col">
                <div className="relative flex h-full flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b">
                    <DialogTitle className="text-lg font-semibold">Add New Pickup Address</DialogTitle>
                    <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                      <IoCloseSharp className="text-2xl" />
                    </button>
                  </div>
                  {/* Steps */}
                  <div className="px-6 py-6">
                    <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="mx-auto w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3"><FaLocationDot /></div>
                        <p className="text-sm text-gray-600">Provide your full address and exact location for accurate pickups</p>
                      </div>
                      <div className="hidden md:flex items-center justify-center text-gray-300">─────────▶</div>
                      <div>
                        <div className="mx-auto w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3"><IoCall /></div>
                        <p className="text-sm text-gray-600">Share contact details of the person handling shipment handover</p>
                      </div>
                      <div className="hidden md:flex items-center justify-center text-gray-300">─────────▶</div>
                      <div>
                        <div className="mx-auto w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">📅</div>
                        <p className="text-sm text-gray-600">Specify your operational hours to ensure pickups are scheduled on time</p>
                      </div>
                    </div>
                  </div>
                  {/* Address Details */}
                  <div className="px-6 space-y-6">
                    <h3 className="font-semibold text-sm">Address Details</h3>
                    {/* Address Tag */}
                    <div>
                      <p className="text-sm font-medium mb-2">Tag this address as</p>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-1.5 text-sm border rounded-full border-indigo-500 text-indigo-600 bg-indigo-50">Home</button>
                        <button className="px-4 py-1.5 text-sm border rounded-full">Work</button>
                        <button className="px-4 py-1.5 text-sm border rounded-full">Warehouse</button>
                        <button className="px-4 py-1.5 text-sm border rounded-full">Other</button>
                      </div>
                    </div>
                    {/* Location Choice */}
                    <div>
                      <p className="text-sm font-medium mb-2">Are you at this address right now?</p>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="location" />
                          Yes, use my present location
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="location" defaultChecked />
                          No, I will add the location manually
                        </label>
                      </div>
                    </div>

                    {/* Search Address */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium">Search for your pickup address location/building/area/landmark</label>
                      <p className="text-xs text-gray-500 mb-2">Please add minimum 5 characters</p>
                      <div className="relative">
                        <input type="text" placeholder="Search Location" className="w-full border rounded-md pl-10 pr-3 py-2 text-sm"/>
                        <span className="absolute left-3 top-2.5 text-gray-400"><IoSearchOutline /></span>
                      </div>
                    </div>

                    {/* Accordions */}
                    <div className="border-t pt-4 flex justify-between items-center text-sm text-gray-600 cursor-pointer">
                      <span>Contact Details</span>
                      <span><IoIosArrowDown /></span>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center text-sm text-gray-600 cursor-pointer">
                      <span>Operational timings</span>
                      <span><IoIosArrowDown /></span>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">+ Add RTO Address and Supplier <IoIosArrowDown /></button>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t flex justify-end gap-4 mt-6">
                    <button onClick={() => setOpenModal(false)} className="px-5 py-2 border border-indigo-500 text-indigo-600 rounded-md text-sm">Cancel</button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm">Verify and Save Address</button>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  </Transition>

  {/* Modal for Edit Pickup Location */}
  <Transition show={openEditModal} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setOpenEditModal}>
      <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-gray-900/50" />
      </Transition.Child>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <DialogPanel className="pointer-events-auto relative w-full max-w-7xl bg-white shadow-xl flex flex-col">
                <div className="overflow-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b">
                    <DialogTitle className="text-lg font-semibold">Edit Pickup Location</DialogTitle>
                    <button onClick={() => setOpenEditModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                      &times;
                    </button>
                  </div>
                  <div className="p-6 space-y-8 max-w-7xl mx-auto">
                    {/* Address Details */}
                    <section className="space-y-4">
                      <h3 className="text-sm font-semibold">Address Details</h3>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-1.5 text-sm rounded-full border border-indigo-500 text-indigo-600 bg-indigo-50">Home</button>
                        <button className="px-4 py-1.5 text-sm rounded-full border">Work</button>
                        <button className="px-4 py-1.5 text-sm rounded-full border">Warehouse</button>
                        <button className="px-4 py-1.5 text-sm rounded-full border">Other</button>
                      </div>
                      {/* Address + Map */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        {/* Address Form */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium">Complete address</label>
                            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Landmark</label>
                            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" placeholder="Nearby landmark" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium">Pincode</label>
                              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-medium">City</label>
                              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-medium">State</label>
                              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium">Country</label>
                            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                          </div>
                        </div>
                        {/* Map Placeholder */}
                        <div className="relative border rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Google Map Preview</span>
                          <button className="absolute bottom-3 right-3 bg-white border px-3 py-1.5 text-xs rounded-md text-indigo-600">✎ Edit Location</button>
                        </div>
                      </div>
                    </section>
                    {/* Contact Details */}
                    <section className="border-t pt-6 space-y-4">
                      <h3 className="text-sm font-semibold">Contact Details</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium">Name</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Contact Number</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                          <span className="text-xs text-green-600 font-medium">✔ Verified</span>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Email Address</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Role</label>
                          <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm">
                            <option>Select Role</option>
                          </select>
                        </div>
                      </div>
                      {/* Alternate Contact */}
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium">Alternate Name</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Alternate Phone</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Email</label>
                          <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Role</label>
                          <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm">
                            <option>Select Role</option>
                          </select>
                        </div>
                      </div>
                    </section>
                    {/* Operational Timings */}
                    <section className="border-t pt-6 space-y-4">
                      <h3 className="text-sm font-semibold">Operational Timings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select className="border rounded-md px-3 py-2 text-sm">
                          <option>Select Days</option>
                        </select>
                        <select className="border rounded-md px-3 py-2 text-sm">
                          <option>Opening Time</option>
                        </select>
                        <select className="border rounded-md px-3 py-2 text-sm">
                          <option>Closing Time</option>
                        </select>
                      </div>
                    </section>
                    {/* RTO & Supplier */}
                    <section className="border-t pt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-indigo-600">+ Add RTO Address and Supplier</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <input className="border rounded-md px-3 py-2 text-sm" placeholder="Supplier/Vendor Name" />
                        <input className="border rounded-md px-3 py-2 text-sm" placeholder="Supplier GSTIN" />
                        <select className="border rounded-md px-3 py-2 text-sm">
                          <option>Select Address</option>
                        </select>
                      </div>
                    </section>
                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-6">
                      <button onClick={() => setOpenEditModal(false)} className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-md text-sm">Cancel</button>
                      <button className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm">Verify and Save Address</button>
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
    
    </>
  )
}

export default AddOrder