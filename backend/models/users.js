/*jslint node: true, indent: 2,nomen:true */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    mail: String,
    fname: String,
    lname: String,
    password: String
  });


module.exports = mongoose.model('Users', userSchema);
