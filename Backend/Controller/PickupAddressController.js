const PickupAddress = require("../Modal/PickupAddress");
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
        const item = await PickupAddress.create(itemData);
        if (item)
            return getSuccessResponse(res, response?.data?.address);

    } catch (error) {
        const message = error.response?.data?.message || error.message;
        console.log(error.response);
        return getErrorResponse(res, 500, message, error.response?.data);
    }

}

exports.getAllPickupAddresses = async (req, res) => {
    try {
        const localList = await PickupAddress.find({}).lean();
        return getSuccessResponse(res, localList);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, 500, message, error.response?.data);
    }
}

exports.getPickupAddressByLocation = async (req, res) => {
    try {
        const { pickup_location } = req.params;
        if (!pickup_location) {
            return res.status(400).json({ success: false, message: "pickup_location is required" });
        }
        const localItem = await PickupAddress.findOne({ pickup_location }).lean();
        return getSuccessResponse(res, localItem);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, 500, message, error.response?.data);
    }
}

exports.updatePickupAddress = async (req, res) => {
    try {
        const { pickup_location } = req.params;
        const { name, phone, email, address, landmark, city, state, country, pincode } = req.body;
        if (!pickup_location) {
            return res.status(400).json({ success: false, message: "pickup_location is required" });
        }
        if (!name || !phone || !email || !address || !city || !state || !country || !pincode) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }
        const updateData = {
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
        const srRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/settings/company/pickup/update`,
            updateData,
            {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${req.token}`,
                },
            }
        );
        const localUpdated = await PickupAddress.findOneAndUpdate(
            { pickup_location },
            updateData,
            { new: true }
        );
        return getSuccessResponse(res, { shiprocket: srRes?.data, local: localUpdated });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        console.log(error.response)
        return getErrorResponse(res, 500, message, error.response?.data);
    }
}

exports.deletePickupAddress = async (req, res) => {
    try {
        const { pickup_location } = req.params;
        if (!pickup_location) {
            return res.status(400).json({ success: false, message: "pickup_location is required" });
        }
        const srRes = await axios.post(
            `${process.env.SHIPROCKET_URL}/settings/company/pickup/delete`,
            { pickup_location },
            {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${req.token}`,
                },
            }
        );
        await PickupAddress.deleteOne({ pickup_location });
        return getSuccessResponse(res, { shiprocket: srRes?.data, local: { deleted: true } });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, 500, message, error.response?.data);
    }
}

exports.setDefaultPickupAddress = async (req, res) => {
    try {
        const { pickup_location } = req.params;
        if (!pickup_location) {
            return res.status(400).json({ success: false, message: "pickup_location is required" });
        }
        const exists = await PickupAddress.findOne({ pickup_location });
        if (!exists) {
            return res.status(404).json({ success: false, message: "Pickup address not found" });
        }
        await PickupAddress.updateMany({}, { $set: { is_default: false } });
        const updated = await PickupAddress.findOneAndUpdate(
            { pickup_location },
            { $set: { is_default: true } },
            { new: true }
        );
        return getSuccessResponse(res, updated);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, 500, message, error.response?.data);
    }
}
