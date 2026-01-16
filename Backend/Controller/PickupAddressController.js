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
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }

}

exports.getAllPickupAddresses = async (req, res) => {
    try {
        const localList = await PickupAddress.find().lean();
        if (!localList) {
            return getErrorResponse(res, 404, 'Pickup addresses not found');
        }
        return getSuccessResponse(res, localList);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}

exports.getPickupAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "pickup_location is required" });
        }
        const localItem = await PickupAddress.findById(id).lean();
        if (!localItem) {
            return getErrorResponse(res, 404, 'Pickup address not found');
        }
        return getSuccessResponse(res, localItem);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}

exports.updatePickupAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Id is required" });
    }

    const data = await PickupAddress.findById(id);
    if (!data) {
      return getErrorResponse(res, 404, "Pickup address not found");
    }

    const updateData = {
      pickup_location: req.body.pickup_location ?? data.pickup_location,
      name: req.body.name ?? data.name,
      phone: req.body.phone ?? data.phone,
      email: req.body.email ?? data.email,
      address: req.body.address ?? data.address,
      address_2: req.body.landmark ?? data.address_2,
      city: req.body.city ?? data.city,
      state: req.body.state ?? data.state,
      country: req.body.country ?? data.country,
      pin_code: req.body.pincode ?? data.pin_code,
    };

    const updated = await PickupAddress.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return getSuccessResponse(res, updated, "Pickup address updated successfully");
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return getErrorResponse(res, 500, message);
  }
};


exports.deletePickupAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Id is required" });
        }

        let data = await PickupAddress.findById(id).lean();
        if (!data) {
            return getErrorResponse(res, 404, 'Pickup address not found');
        }

        await PickupAddress.findByIdAndDelete(id);
        return getSuccessResponse(res, data);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}

exports.setDefaultPickupAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Id is required" });
        }
        const exists = await PickupAddress.findById(id);
        if (!exists) {
            return res.status(404).json({ success: false, message: "Pickup address not found" });
        }
        await PickupAddress.updateMany({}, { $set: { is_default: false } });
        const updated = await PickupAddress.findByIdAndUpdate(
            id,
            { $set: { is_default: true } },
            { new: true }
        );
        return getSuccessResponse(res, updated);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
}
