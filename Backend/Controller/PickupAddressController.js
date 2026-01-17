const { getErrorResponse } = require("../utils/Error.utils");
const { getSuccessResponse } = require("../utils/Succes.utils");
const { default: axios } = require("axios");

exports.addPickupAddress = async (req, res) => {
    try {
        const { pickup_location, name, phone, email, address, landmark, city, state, country, pincode } = req.body

        if (!pickup_location || !name || !phone || !email || !address || !city || !state || !country || !pincode) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const itemData = {
            pickup_location,
            name,
            phone,
            email,
            address,
            address_2: landmark,
            city,
            state,
            country,
            pin_code: pincode
        }

        const response = await axios.post(
            `${process.env.SHIPROCKET_URL}/settings/company/addpickup`,
            itemData,
            {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${req.token}`,
                },
            }
        );
        return getSuccessResponse(res, response?.data?.address);

    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }

}

exports.getAllPickupAddresses = async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.SHIPROCKET_URL}/settings/company/pickup`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${req.token}`,
                },
            }
        );

        const addresses = response.data.data.shipping_address;
        return getSuccessResponse(res, addresses);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}










