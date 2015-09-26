/*jslint node: true, indent: 2,nomen:true */
'use strict';
// BASE SETUP
// =============================================================================
var express = require('express'),
  app = express(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  router = express.Router(),
  myRoutes = require('./routes/index'),
  fs = require('fs'),
  configData = require('./config');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());


var port = process.env.PORT || 8080, // set our port
  mongoURL = (configData.directory + configData.username + configData.password
            + configData.direction  + configData.portNum + configData.dbName);

mongoose.connect(mongoURL);
// ROUTES
// =============================================================================

router.use(function (next) {
  next();
});

myRoutes(app);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is running in port: ' + port + '\nUsing the mongoURL:' + mongoURL);
