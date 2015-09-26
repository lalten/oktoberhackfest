/*jslint node: true, indent: 2,nomen:true */
var mongoose = require('mongoose');

var folderSchema = mongoose.Schema({
  name: String,
  URL: String
});

//Yeh, it should have even more but I have to prototype everything
module.exports = mongoose.model('Folders', folderSchema);
