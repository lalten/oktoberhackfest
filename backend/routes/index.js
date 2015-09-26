/*jslint node: true, indent: 2,nomen:true */
'use strict';
var folders = require('./folderRoutes'),
  users = require('./userRoutes'),
  locations = require('./locationRoutes');

module.exports = function (app) {
  app.use('/v1/users', users);
  app.use('/v1/locations', locations);
  // app.use('/v1/folders', folders);
};
