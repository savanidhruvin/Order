const Order = require("../Modal/Order");
const { getErrorResponse } = require("../utils/Error.utils");
const { getSuccessResponse } = require("../utils/Succes.utils");
const { default: axios } = require("axios");

function getTodayDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
async function getPrimaryPickupAddress(token) {
    const response = await axios.get(
        `${process.env.SHIPROCKET_URL}/settings/company/pickup`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const addresses = response.data.data.shipping_address;

    const primaryAddress = addresses.find(
        (addr) => addr.is_primary_location === 1
    );

    //   console.log("Primary Pickup Address:", primaryAddress);

    return primaryAddress;
}
exports.createReturnOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const orderId = req.params.id;

        if (!orderId || !reason) {
            return res.status(400).json({ success: false, message: "orderId & reason required" });
        }

        const order = await Order.findById(orderId);
        if (!order) return getErrorResponse(res, 404, "Order not found");

        const pickupAddress = await getPrimaryPickupAddress(req.token);

        const order_items = order.items.map(item => ({
            name: item.name,
            sku: item.name.slice(0, 10),
            units: item.qty,
            selling_price: item.price,
            hsn: item.hsn,
        }));

        const body = {
            order_id: `RET-${order._id}`,
            order_date: getTodayDateTime(),

            pickup_customer_name: order.shippingInfo.firstName,
            pickup_address: order.shippingInfo.address,
            pickup_city: order.shippingInfo.city,
            pickup_state: order.shippingInfo.state,
            pickup_pincode: order.shippingInfo.pincode,
            pickup_phone: order.shippingInfo.phone,
            pickup_country: order.shippingInfo.country,

            shipping_customer_name: pickupAddress.name,
            shipping_address: pickupAddress.address,
            shipping_city: pickupAddress.city,
            shipping_state: pickupAddress.state,
            shipping_pincode: pickupAddress.pin_code,
            shipping_phone: pickupAddress.phone,
            shipping_country: pickupAddress.country,

            order_items,
            payment_method: "Prepaid",
            return_reason: reason,

            sub_total: parseInt(order.subTotal),
            length: Number(order.dimension.length),
            breadth: Number(order.dimension.breadth),
            height: Number(order.dimension.height),
            weight: Number(order.dimension.weight)
        };

        const response = await axios.post(
            `${process.env.SHIPROCKET_URL}/orders/create/return`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${req.token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const shipmentId = response.data.shipment_id;

        // for create shipmenet

        // await processReturn(req, shipmentId, order._id);

        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            {
                returnShipmentId: shipmentId,
                returnOrderDetail: response.data,
                status: "return"
            },
            { new: true }
        );

        // background process (no res inside)


        return getSuccessResponse(res, response.data, "Return order created");

    } catch (error) {
        const message = error?.response?.data || error.message;
        return getErrorResponse(res, 500, message);
    }
};

const processReturn = async (req, shipment_id, orderId) => {
    try {
        if (!shipment_id) return;

         const headers = {
            Authorization: `Bearer ${req.token}`,
            "Content-Type": "application/json"
        };

        const courierRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/assign/awb`,
            { shipment_id,is_return: 1 },
            { headers }
        );

        const awb = courierRes.data?.data?.awb_code || courierRes.data?.awb_code;

        const labelRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/label`,
            { shipment_id },
            { headers }
        );

        const label_url = labelRes.data?.data?.label_url || labelRes.data?.label_url;

        await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/pickup`,
            { shipment_id },
            { headers }
        );

        await Order.findByIdAndUpdate(orderId, {
            returnAwb: awb,
            returnLabel:label_url,
            returnTracking: `https://shiprocket.co/tracking/${awb}`,
            returnStatus: "pickup_scheduled"
        });

        return getSuccessResponse(res, orderData, "Order shipment done successfully");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message
        throw new Error(message)
    };
}



exports.returnCheckavailblity = async (req,res)=>{
    
        try {
            const { pickupPincode, weight } = req.body;
            if (!pickupPincode) {
                return res.status(400).json({ success: false, message: "Pickup Pincode required" });
            }
            let pickupAddress = await getPrimaryPickupAddress(req.token)
            const response = await axios.get(
                `${process.env.SHIPROCKET_URL}/courier/serviceability/`,
                {
                    params: {
                        pickup_postcode: pickupPincode ,
                        delivery_postcode: pickupAddress.pin_code,
                        weight: weight || 1,
                        cod: 0   // 1 for COD, 0 for prepaid
                    },
                    headers: {
                        Authorization: `Bearer ${req.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response?.data.status === 404) {
                return getErrorResponse(res, 404, 'Not courrier service availble fro this pincode');
            }
    
            return getSuccessResponse(res, response.data.data, "Data get Succesfully");
        }
        catch (error) {
            const message = error?.response?.data || error?.message;
            return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
        }
}


exports.mannualReturnpartner = async (req, res) => {
    try {
        const { courierId } = req.body;
        const { id } = req.params; // orderId

        if (!courierId || !id) {
            return getErrorResponse(res, 400, "orderId and courierId required");
        }

        const order = await Order.findById(id);
        if (!order || !order.returnShipmentId) {
            return getErrorResponse(res, 404, "Return shipment not found");
        }

        const headers = {
            Authorization: `Bearer ${req.token}`,
            "Content-Type": "application/json"
        };

        // 1️⃣ Assign courier
        const courierRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/assign/awb`,
            {
                shipment_id: order.returnShipmentId,
                courier_id: courierId
            },
            { headers }
        );

        const awb = courierRes.data?.data?.awb_code || courierRes.data?.awb_code;
        if (!awb) throw new Error("AWB not generated");

        // 2️⃣ Generate label
        const labelRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/label`,
            { shipment_id: order.returnShipmentId },
            { headers }
        );

        const label_url = labelRes.data?.data?.label_url || labelRes.data?.label_url;

        // 3️⃣ Schedule pickup
        await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/pickup`,
            { shipment_id: order.returnShipmentId },
            { headers }
        );

        // 4️⃣ Save in DB
        await Order.findByIdAndUpdate(id, {
            returnAwb: awb,
            returnLabel: label_url,
            returnTracking: `https://shiprocket.co/tracking/${awb}`,
            returnCourierId: courierId,
            returnStatus: "pickup_scheduled"
        });

        return getSuccessResponse(res, {
            awb,
            label_url,
            tracking: `https://shiprocket.co/tracking/${awb}`
        }, "Return courier assigned successfully");

    } catch (error) {
        const message = error?.response?.data || error.message;
        return getErrorResponse(res, 500, message);
    }
};