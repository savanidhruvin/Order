
const express = require('express');
const { Authentication } = require('../Controller/Auth');
const routes = express.Router();

routes.get('/getToken',Authentication);

module.exports = routes;
