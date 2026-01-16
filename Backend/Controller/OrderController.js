
const Order = require("../Modal/Order");
const PickupAddress = require("../Modal/PickupAddress");
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

        if (!shippingInfo || !items || !subTotal || !discount || !dimension) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        let pickupAddress = await PickupAddress.findOne({ is_default: true })

        if (!pickupAddress) {
            return res.status(400).json({ success: false, message: "no default pickup Address set." });
        }

        // Create new order
        const order = await Order.create({
            pickup_location: pickupAddress?._id,
            items,
            shippingInfo,
            subTotal,
            discount: discount,
            dimension,
        });
        await createShipping(req, res, order);

        return getSuccessResponse(res, order, "Order created successfully");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message);
    }
};


const createShipping = async (req, res, order) => {
    try {
        let pickupAddress = await PickupAddress.findById(order?.pickup_location)

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

        // const autoProcess = await processShiprocketShipment(req, response.data.payload.shipment_id)


        await Order.findByIdAndUpdate(
            order._id,
            {
                orderId: response.data.payload.order_id,
                shipmentId: response.data.payload.shipment_id,
                // awb: autoProcess.awb,
                // label_url: autoProcess.label_url,
                // tracking_url: autoProcess.tracking_url,
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
const processShiprocketShipment = async (req, shipment_id) => {
    try {
        const headers = {
            Authorization: `Bearer ${req.token}`,
            "Content-Type": "application/json"
        }
        console.log(shipment_id)

        const courierRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/assign/awb`,
            { shipment_id },
            { headers }
        )

        const awb = courierRes.data.awb_code

        const labelRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/label`,
            { shipment_id },
            { headers }
        )

        const label_url = labelRes.data.label_url

        await axios.post(
            `${process.env.SHIPROCKET_URL}/courier/generate/pickup`,
            { shipment_id },
            { headers }
        )

        return {
            success: true,
            awb,
            label_url,
            tracking_url: `https://shiprocket.co/tracking/${awb}`
        }

    } catch (error) {
        const message = error?.response?.data?.message || error?.message
        console.log(error?.response)
        throw new Error(message)
    }
}


exports.checkServiceability = async (req, res) => {

    try {
        const { deliveryPincode, weight } = req.body;
        if (!deliveryPincode) {
            return res.status(400).json({ success: false, message: "Delivery Pincode required" });
        }
        let pickupAddress = await PickupAddress.findOne({ is_default: true })
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

        return getSuccessResponse(res, response.data.data, "Order created successfully");
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
        let pickupAddress = await PickupAddress.findOne({ is_default: true })
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
        const localList = await Order.find().lean();
        if (!localList || !localList.length) {
            return getErrorResponse(res, 404, 'order not found');
        }
        return getSuccessResponse(res, localList);
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
        const localItem = await Order.findById(id).lean();
        if (!localItem) {
            return getErrorResponse(res, 404, 'order not found');
        }
        return getSuccessResponse(res, localItem);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}