/*jslint node: true, indent: 2,nomen:true */
'use strict';
var express = require('express'),
  router = express.Router(),
  Folder = require('../models/folders'),
  expressJoi = require('express-joi'),
  validateFolder = {
    URL: expressJoi.Joi.types.String().required(),
    name: expressJoi.Joi.types.String().required(),
  };

router.get('/', function (req, res) {
  Folder.find(
    req.query,
    function (err, folders) {
      if (err) {
        return console.error(err);
      }
      console.log(req.params);
      res.send(folders);
    }
  );
});


router.get('/:_id', function (req, res) {
  Folder
    .findOne({
      _id: req.params._id
    },
      function (err, folder) {
        if (err) {
          return console.error(err);
        }
        if (folder) {
          res.send(folder);
        } else {
          var folderMessage = req.params._id + 'does not exists.';
          res.send({
            'status': '404 not found',
            'message': folderMessage
          });
        }
      });
});

router.delete('/:_id', function (req, res) {
  Folder.remove({
    _id: req.params._id
  },
    function (err, folder) {
      if (err) {
        return console.error(err);
      }
      if (folder.result === 0) {
        res.send({
          success: true,
          message: 'No folder with that ID found'
        });
      } else {
        res.send({
          success: true,
          message: 'Folders with ID deleted: ' + req.params._id
        });
      }
    });
});

router.patch('/:_id', function (req, res) {
  Folder
    .findByIdAndUpdate(req.path.substring(1),
      req.body,
      function (err, folder) {
        if (err) {
          return console.error(err);
        }
        res.send({
          success: true,
          message: 'Folders with ID UPDATED: ' + req.params._id,
          updatedFolder: folder
        });
      });
});


router.post('/', expressJoi.joiValidate(validateFolder), function (req, res) {
  var folder = new Folder({
    URL: req.body.URL,
    name: req.body.name
  });
  folder.save(function (err) {
    if (err) {
      return res.send({Error: err});
    }
    res.status(200)
      .send({
        saved: true,
        _id: folder.id,
        object: folder
      });
  });
});

// ===============Debug purposes only==================

router.delete('/', function (req, res) {
  Folder.remove(function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(req.params);
    res.send({
      succes: true,
      message: 'Everything was deleted'
    });
  });
});

module.exports = router;
