/*jslint node: true, indent: 2,nomen:true */
var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  name: String,
  loc: {
    type: [Number], // [<longitude>, <latitude>]
    index: '2d' // create the geospatial index
  }
});


module.exports = mongoose.model('Locations', locationSchema);
