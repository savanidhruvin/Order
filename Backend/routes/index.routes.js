
const express = require('express');
const { Authentication } = require('../Controller/Auth');
const { addPickupAddress, getAllPickupAddresses, getPickupAddressByLocation, updatePickupAddress, deletePickupAddress, setDefaultPickupAddress, getPickupAddressById } = require('../Controller/PickupAddressController');
const getToken = require('../utils/getShiprocketToken');
const { createOrder, checkServiceability, getChargeandday, cancleOrder, getAllOrder, getOrderById, mannualShipment } = require('../Controller/OrderController');
const routes = express.Router();

routes.get('/getToken',Authentication);

// pickup address api
routes.post('/addPickupaddress',getToken,addPickupAddress);
routes.get('/pickupAddresses',getToken, getAllPickupAddresses);

// order api 
routes.post('/createOrder',getToken, createOrder)
routes.get('/getAllOrder',getAllOrder)
routes.get('/getOrderbyId/:id',getOrderById)
routes.post('/mannualShipment/:id',getToken,mannualShipment)

// check availbility
routes.post('/checkAvailbility',getToken,checkServiceability)

//get delivery charge and days
routes.post('/getChargeandDay',getToken,getChargeandday)

// cancle order 
routes.put('/cancleOrder/:id',getToken,cancleOrder)
module.exports = routes;
