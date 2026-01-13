import React from 'react'
import { FaLessThan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";

const Order = () => {
  return (
  <div className="px-6 pt-4">
    <div className="flex items-center gap-2 text-gray-900">
      <button className="text-xl font-medium"><FaLessThan /></button>
      <h1 className="text-lg font-semibold">Add Order</h1>
    </div>
    {/* <div className="mt-6 border-b border-gray-200">
      <div className="flex gap-6 text-sm font-medium">
        <button className="relative pb-3 text-purple-600">Domestic Order
          <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-purple-600 rounded"></span>
        </button>
        <button className="pb-3 text-gray-400 hover:text-gray-600">International Order</button>
      </div>
    </div> */}
    <div className="mx-auto">
      <div className="inline-flex rounded-md border border-gray-300 overflow-hidden mb-6">
        <button className="px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-50">Single Order</button>
        <button className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100">Bulk Order</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Pickup Address</h3>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><MdOutlineEdit /></button>
            <button className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><LuPlus /></button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border rounded-md px-4 py-3">
          <span className="text-sm font-medium">Home | 11 sarita vihar South Delhi Delhi-110076</span>
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">✔ Verified
            <span className="text-gray-400"><FaAngleDown /></span>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-sm mb-1">Delivery Details</h3>
        <p className="text-xs text-gray-500 mb-5">Enter the Delivery Details of your buyer for whom you are making this order</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-600">Mobile Number</label>
            <div className="flex mt-1">
              <span className="px-3 py-2 border border-r-0 rounded-l-md text-sm bg-gray-100">+91</span>
              <input className="w-full border rounded-r-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-purple-500" placeholder="Enter mobile number"/>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Full Name</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Enter Full Name"/>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-gray-600">Complete Address</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Enter Buyer's full address"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">Landmark <span className="text-gray-400">(Optional)</span></label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Enter any nearby landmark"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">Pincode</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Enter pincode"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">City</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-50" placeholder="City"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">State</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-50" placeholder="State"/>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-md flex items-center gap-2">
          <input type="checkbox" checked className="accent-purple-600" />
          <span className="text-sm font-medium">Billing Details are same as Delivery Details</span>
        </div>
      </div>
    </div>

    <div className="mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600">Product Name</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Enter or search your product name"/>
          </div>

          <div>
            <label className="text-xs text-gray-600">Unit Price</label>
            <div className="flex mt-1">
              <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-sm">₹</span>
              <input className="w-full border rounded-r-md px-3 py-2 text-sm" value="0.00" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Quantity</label>
            <div className="mt-1 flex border rounded-md overflow-hidden">
              <button className="px-3 bg-gray-100 text-sm"><FiMinus /></button>
              <input className="w-full text-center text-sm" value="1" />
              <button className="px-3 bg-gray-100 text-sm"><LuPlus /></button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Product Discount <span className="text-gray-400">(Optional)</span></label>
            <div className="flex mt-1">
              <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-sm">₹</span>
              <input className="w-full border rounded-r-md px-3 py-2 text-sm" value="0.00" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Tax Rate <span className="text-gray-400">(Optional)</span></label>
            <div className="flex mt-1">
              <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-sm">%</span>
              <input className="w-full border rounded-r-md px-3 py-2 text-sm" value="0.00" />
            </div>
          </div>
          <button className="text-red-500 text-lg mb-1">🗑</button>
        </div>

        <button className="mt-4 text-sm text-purple-600 border border-purple-300 px-4 py-1.5 rounded-md">+ Add Another Product</button>

        <div className="mt-6 bg-gray-50 px-4 py-3 rounded-md text-sm font-medium flex items-center justify-between">Add Other Charges & Discount
          <span className="text-gray-400">(Optional)</span>
        </div>

        <div className="mt-6 bg-blue-50 rounded-md p-4 text-sm">
          <div className="flex justify-between mb-2">
            <span>Sub-total for Product</span>
            <span>₹ 0</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Other Charges</span>
            <span>₹ 0</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Order Value</span>
            <span>₹ 0</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500">Note: All the Prices/ Charges are inclusive of GST.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-1">Payment Method</h3>
        <p className="text-xs text-gray-500 mb-4">Select the payment mode, chosen by the buyer for this order.</p>
        <div className="flex gap-4">
          <label className="border rounded-md px-4 py-3 flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payment" />
            <span className="text-sm">Cash on Delivery</span>
          </label>
          <label className="border rounded-md px-4 py-3 flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payment" />
            <span className="text-sm">Prepaid</span>
          </label>
        </div>
      </div>
    </div>

    <div className="mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold">Package Details</h3>
            <p className="text-xs text-gray-500 mt-1">Provide the details of the final package that includes all the ordered items packed together.</p>
          </div>
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs px-3 py-2 rounded-md">💡 Tip: Add correct values to avoid weight discrepancy</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <label className="text-xs font-medium">Dead Weight</label>
            <p className="text-xs text-gray-500 mb-1">Physical weight of a package</p>
            <div className="flex">
              <input className="w-full border rounded-l-md px-3 py-2 text-sm" value="0.00" />
              <span className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-sm">kg</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Note: Minimum chargeable wt is 0.5 kg</p>
          </div>

          <div className="md:col-span-6">
            <label className="text-xs font-medium">Package Dimensions</label>
            <p className="text-xs text-gray-500 mb-1">L×B×H of the complete package</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex">
                <input className="w-full border rounded-l-md px-3 py-2 text-sm" placeholder="Length" />
                <span className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-sm">cm</span>
              </div>
              <div className="flex">
                <input className="w-full border rounded-l-md px-3 py-2 text-sm" placeholder="Breadth" />
                <span className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-sm">cm</span>
              </div>
              <div className="flex">
                <input className="w-full border rounded-l-md px-3 py-2 text-sm" placeholder="Height" />
                <span className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-sm">cm</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-1">Note: Value should be greater than 0.50 cm</p>
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium flex items-center gap-1">Volumetric Weight
              <span className="text-gray-400">?</span>
            </label>
            <div className="flex mt-5">
              <input className="w-full border rounded-l-md px-3 py-2 text-sm bg-gray-50" value="0" />
              <span className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100 text-sm">kg</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">⚖</div>
          <div>
            <p className="text-sm font-semibold">Applicable Weight: <span className="text-green-700">0 kg</span></p>
            <p className="text-xs text-gray-600">Applicable weight is the higher of the dead weight or volumetric weight, used by the courier for freight charges.</p>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md text-sm">
          <span><strong>Pack like a Pro</strong> - Guidelines for Packaging and Measuring</span>
          <button className="text-purple-600 font-medium flex items-center gap-1">See Guidelines <FaAngleDown /></button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Order
