const { default: axios } = require("axios");
const { getErrorResponse } = require("../utils/Error.utils");
const { getSuccessResponse } = require("../utils/Succes.utils")


exports.Authentication = async (req, res) => {
    try {
        const param = {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASS
        };

        const response = await axios.post(
            `${process.env.SHIPROCKET_URL}/auth/login`,
            param,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return getSuccessResponse(res, response?.data?.token);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return getErrorResponse(res, error?.response?.data?.status_code || 500, message,);
    }
};
