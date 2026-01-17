
const express = require('express');
const { Authentication } = require('../Controller/Auth');
const { addPickupAddress, getAllPickupAddresses, getPickupAddressByLocation, updatePickupAddress, deletePickupAddress, setDefaultPickupAddress, getPickupAddressById } = require('../Controller/PickupAddressController');
const getToken = require('../utils/getShiprocketToken');
const { createOrder, checkServiceability, getChargeandday, cancleOrder, getAllOrder, getOrderById, mannualShipment } = require('../Controller/OrderController');
const { createReturnOrder, returnCheckavailblity } = require('../Controller/ReturnOrderController');
const routes = express.Router();

routes.get('/getToken',Authentication);

// pickup address api
routes.post('/addPickupaddress',getToken,addPickupAddress);
routes.get('/pickupAddresses',getToken, getAllPickupAddresses);

// order api 
routes.post('/createOrder',getToken, createOrder)
routes.get('/getAllOrder',getToken,getAllOrder)
routes.get('/getOrderbyId/:id',getToken,getOrderById)
routes.post('/mannualShipment/:id',getToken,mannualShipment)
// cancle order 
routes.put('/cancleOrder/:id',getToken,cancleOrder)

// check availbility
routes.post('/checkAvailbility',getToken,checkServiceability)

//get delivery charge and days
routes.post('/getChargeandDay',getToken,getChargeandday)


// return order
routes.post('/returnOrder/:id',getToken,createReturnOrder);
routes.post('/checkreturnAvailbility',getToken,returnCheckavailblity)
module.exports = routes;
