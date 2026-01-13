
const express = require('express');
const { Authentication } = require('../Controller/Auth');
const { addPickupAddress, getAllPickupAddresses, getPickupAddressByLocation, updatePickupAddress, deletePickupAddress, setDefaultPickupAddress } = require('../Controller/PickupAddressController');
const getToken = require('../utils/getShiprocketToken');
const routes = express.Router();

routes.get('/getToken',Authentication);
routes.post('/addPickupPddress',getToken,addPickupAddress);
routes.get('/pickup-addresses', getToken, getAllPickupAddresses);
routes.get('/pickup-addresses/:pickup_location', getToken, getPickupAddressByLocation);
routes.put('/pickupaddresses/:pickup_location', getToken, updatePickupAddress);
routes.delete('/pickup-addresses/:pickup_location', getToken, deletePickupAddress);
routes.put('/pickup-addresses/:pickup_location/default', getToken, setDefaultPickupAddress);

module.exports = routes;
