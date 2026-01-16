
const express = require('express');
const { Authentication } = require('../Controller/Auth');
const { addPickupAddress, getAllPickupAddresses, getPickupAddressByLocation, updatePickupAddress, deletePickupAddress, setDefaultPickupAddress, getPickupAddressById } = require('../Controller/PickupAddressController');
const getToken = require('../utils/getShiprocketToken');
const routes = express.Router();

routes.get('/getToken',Authentication);
routes.post('/addPickupaddress',getToken,addPickupAddress);
routes.get('/pickupAddresses', getToken, getAllPickupAddresses);
routes.get('/pickupAddresses/:id', getToken, getPickupAddressById);
routes.put('/pickupaddresses/:id', getToken, updatePickupAddress);
routes.delete('/pickupAddresses/:id', getToken, deletePickupAddress);
routes.put('/pickupAddresses/default/:id', getToken, setDefaultPickupAddress);

module.exports = routes;
