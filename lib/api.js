/*!
 * EPM REST
 *
 * Copyright(c) 2015 Dirección de Tecnología Educativa de Buenos Aires (Dte-ba)
 * GPL Plublic License v3
 */

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var modules = require('./modules');
var finder = require('epm').finder;

module.exports = function(ops) {
  'use strict';

	var app = express();
  ops = ops || {};
	var dir = ops.path;
  // share the instances of repositories in a dictionary
  var instances = ops.instances || {};

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));	

  var router = express.Router();  

	router.get('/', function(req, res) {
    finder.find(dir, function(err, repos){
      res.json({ 
        api: 'EPM api rest', 
        version: require('../package.json').version,
        repositories: repos
      });
    });
	});

	app.use('/epm', router);

  modules.configure(router, dir, instances);

  if (app.get('env') === 'development') {
    router.use(function(err, req, res, next) {
      res.status(err.status || 500);
      if (err.status !== 404) {
        console.error(err.stack);
      }
      if (!res.headersSent) {
        res.json({
          error: err.message,
          stack: err
        });
      }
    });
  }

  // production error handler
  // no stacktraces leaked to user
  router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (!res.headersSent) {
      res.json({
        error: err.message,
        stack: {}
      });
    }
  });

	return app;
};