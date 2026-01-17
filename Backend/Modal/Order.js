const mongoose = require("mongoose");
const pickupAddressSchema = new mongoose.Schema(
    {
        pickup_location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PickupAddress',
        },
        orderId: {
            type: Number,
        },
        order_date: {
            type: String
        },
        shipmentId: {
            type: Number,
        },
        items: {
            type: Array,
            require: true,
        },
        shippingInfo: {
            firstName: {
                type: String,
                require: true,
            },
            lastName: {
                type: String,
                require: true,
            },
            email: {
                type: String,
                require: true,
            },
            phone: {
                type: Number,
                require: true,
            },
            address: {
                type: String,
                require: true,
            },
            city: {
                type: String,
                require: true,
            },
            state: {
                type: String,
                require: true,
            },
            country: {
                type: String,
                require: true,
            },
            pincode: {
                type: Number,
                require: true,
            }
        },
        subTotal: {
            type: Number,
            require: true
        },
        discount: {
            type: Number,
            require: true,
        },
        dimension: {
            length: {
                type: Number
            },
            breadth: {
                type: Number
            },
            height: {
                type: Number
            },
            weight: {
                type: Number
            },
        },
        shipmentDetail: {
            type: Object
        },
        status:{
            type:String,
            enum:['pending','proccess','cancle','return'],
            default:'pending'
        },
        awb:{
            type : String
        },
        label_url:{
            type : String
        },
        tracking_url:{
            type : String
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", pickupAddressSchema);
