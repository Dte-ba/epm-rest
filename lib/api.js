/*!
 * EPM REST API
 *
 * Copyright(c) 2015 Dirección de Tecnología Educativa de Buenos Aires (Dte-ba)
 * GPL Plublic License v3
 */

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

module.exports = function(ops) {
  'use strict';
  
	var app = express();
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));	

  var router = express.Router();  

	router.get('/', function(req, res) {
    res.json({ api: 'EPM api rest', version: require('../package.json').version });   
	});

	app.use('/api', router);

	return app;
};