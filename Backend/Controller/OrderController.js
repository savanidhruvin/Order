
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

exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingInfo,
            subTotal,
            discount,
            dimension,
        } = req.body;

        // startDate = new Date();

        if (!shippingInfo || !items || !subTotal  || !dimension) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        // Create new order
        const order = await Order.create({
            items,
            shippingInfo,
            subTotal,
            discount: discount,
            dimension,
        });
        
        // await createShipping(req, res, order);

        return getSuccessResponse(res, order, "Order created successfully");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
    }
};


const createShipping = async (req, res, order) => {
    try {
        let pickupAddress = await getPrimaryPickupAddress(req.token)

        const order_items = order.items.map(item => ({
            name: item.name,
            sku: item.name.slice(0, 10),
            units: item.qty,
            selling_price: item.price,
            discount: item.discount || "",
            tax: item.tax || "",
            hsn: item.hsn,
        }))

        const body = {
            order_id: `${order._id}`,
            order_date: getTodayDateTime(order.created),
            pickup_location: pickupAddress?.pickup_location,

            // "comment": "testing e-com project",

            billing_customer_name: order.shippingInfo.firstName,
            billing_last_name: order.shippingInfo.lastName,
            billing_address: order.shippingInfo.address,
            billing_city: order.shippingInfo.city,
            billing_pincode: order.shippingInfo.pincode,
            billing_state: order.shippingInfo.state,
            billing_country: order.shippingInfo.country,
            billing_email: order.shippingInfo.email,
            billing_phone: order.shippingInfo.phone,

            shipping_is_billing: true,
            // "shipping_customer_name": ,
            //  "shipping_last_name": ,
            //  "shipping_address": ,
            // "shipping_city": , 
            //  "shipping_pincode": ,
            //   "shipping_country": "India", 
            //  "shipping_state": , 
            //  "shipping_email": , 
            //  "shipping_phone": ,
            //  "order_items": order_items,
            //  "payment_method": "Prepaid", 
            //  "shipping_charges": 0, 
            //  "giftwrap_charges": 0, 
            //  "transaction_charges": 0, 
            // "total_discount": 0,

            order_items,
            payment_method: "Prepaid",

            sub_total: parseInt(order.subTotal),
            length: Number(order.dimension.length) || 0,
            breadth: Number(order.dimension.breadth) || 0,
            height: Number(order.dimension.height) || 0,
            weight: Number(order.dimension.weight) || 0
        }

        const response = await axios.post(
            `${process.env.SHIPROCKET_URL}/shipments/create/forward-shipment`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${req.token}`,
                },
            }
        );

        // for  automatic courrier generate

        // const autoProcess = await automaticShipment(req, response.data.payload.shipment_id)


        await Order.findByIdAndUpdate(
            order._id,
            {
                orderId: response.data.payload.order_id,
                shipmentId: response.data.payload.shipment_id,
                shipmentDetail: response.data.payload,
                order_date: getTodayDateTime(order.created)
            },
            { new: true, runValidators: true }
        );

        return true;

    } catch (error) {
        const message = error?.response?.data || error?.message;
        // console.log(error?.response)
        throw new Error(message);
    }
}

// current this not worked to run this do kyc 
const automaticShipment = async (req, shipment_id) => {
    try {
        const headers = {
            Authorization: `Bearer ${req.token}`,
            "Content-Type": "application/json"
        }

        const courierRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/assign/awb`,
            { shipment_id },
            { headers }
        )

        const awb = courierRes.data?.data?.awb_code || courierRes.data?.awb_code
        if (!awb) throw new Error("AWB not generated")

        const labelRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/label`,
            { shipment_id },
            { headers }
        )

        const label_url = labelRes.data?.data?.label_url || labelRes.data?.label_url

        await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/pickup`,
            { shipment_id },
            { headers }
        )

        const orderData = await Order.updateOne(
            { shipmentId: shipment_id },
            {
                awb,
                label_url,
                tracking_url: `https://shiprocket.co/tracking/${awb}`
            }
        )

        return getSuccessResponse(res, orderData, "Order shipment done successfully");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message
        throw new Error(message)
    }
}

exports.mannualShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { courierId } = req.body;

        if (!id || !courierId) {
            return res.status(400).json({ success: false, message: "orderId and courierId is require" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        const headers = {
            Authorization: `Bearer ${req.token}`,
            "Content-Type": "application/json"
        }

        const courierRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/assign/awb`,
            {
                shipment_id: order.shipmentId,
                courier_id: courierId,
            },
            { headers }
        )

        const awb = courierRes.data?.data?.awb_code || courierRes.data?.awb_code

        const labelRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/label`,
            { shipment_id: order.shipmentId },
            { headers }
        )

        const label_url = labelRes.data?.data?.label_url || labelRes.data?.label_url

        await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/pickup`,
            { shipment_id: order.shipmentId },
            { headers }
        )

        const orderData = await Order.updateOne(
            { shipmentId: order.shipmentId },
            {
                awb,
                label_url,
                tracking_url: `https://shiprocket.co/tracking/${awb}`
            }
        )
        return {
            success: true,
            orderData
        }

    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
    }
};

exports.checkServiceability = async (req, res) => {

    try {
        const { deliveryPincode, weight } = req.body;
        if (!deliveryPincode) {
            return res.status(400).json({ success: false, message: "Delivery Pincode required" });
        }
        let pickupAddress = await getPrimaryPickupAddress(req.token)
        const response = await axios.get(
            `${process.env.SHIPROCKET_URL}/courier/serviceability/`,
            {
                params: {
                    pickup_postcode: pickupAddress.pin_code,
                    delivery_postcode: deliveryPincode,
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

};

exports.getChargeandday = async (req, res) => {

    try {
        const { deliveryPincode, weight } = req.body;
        if (!deliveryPincode) {
            return res.status(400).json({ success: false, message: "Delivery Pincode required" });
        }
        let pickupAddress = await getPrimaryPickupAddress(req.token)
        const response = await axios.get(
            `${process.env.SHIPROCKET_URL}/courier/serviceability/`,
            {
                params: {
                    pickup_postcode: pickupAddress.pin_code,
                    delivery_postcode: deliveryPincode,
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
        const likelyCourier = response?.data?.data?.available_courier_companies
            .filter(c => !c.blocked)
            .sort((a, b) => {
                // higher delivery + pickup performance first
                const scoreA = a.delivery_performance + a.pickup_performance
                const scoreB = b.delivery_performance + b.pickup_performance
                return scoreB - scoreA
            })[0]
        return getSuccessResponse(res,
            {
                "id": likelyCourier?.id,
                "price": likelyCourier?.rate,
                "estimatedDeliveryDays": likelyCourier?.estimated_delivery_days,
                "estimatedDeliveryDate": likelyCourier?.etd,
                "rating": likelyCourier?.rating,
                "courrierCompanyId": likelyCourier?.courier_company_id,
                "courierName": likelyCourier?.courier_name
            }, "Get Delivery Detail");
    }
    catch (error) {
        const message = error?.response?.data || error?.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
    }

};

exports.cancleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        // Call Shiprocket API to cancel shipment

        const cancelResponse = await axios.post(
            `${process.env.SHIPROCKET_URL}/orders/cancel`,
            {
                ids: [order.orderId]
            },
            {
                headers: {
                    Authorization: `Bearer ${req.token}`,
                    "Content-Type": "application/json",
                },
            }
        );


        order.status = "cancle";
        await order.save();
        return getSuccessResponse(res, order, "Order cancle successfully");

    } catch (error) {
        const message = error?.response?.data || error?.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
    }
}


exports.getAllOrder = async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.SHIPROCKET_URL}/orders`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${req.token}`,
                },
            }
        );
        const order = response.data.data;
        return getSuccessResponse(res, order);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "id is required" });
        }
         const response = await axios.get(
            `${process.env.SHIPROCKET_URL}/orders/show/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${req.token}`,
                },
            }
        );
        if (!response) {
            return getErrorResponse(res, 404, 'order not found');
        }
        const order = response.data.data;
        return getSuccessResponse(res,  order);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}