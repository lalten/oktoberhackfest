/*jslint node: true, indent: 2,nomen:true */
'use strict';
var express = require('express'),
  router = express.Router(),
  Location = require('../models/locations'),
  expressJoi = require('express-joi'),
  validateLocation = {
    longitude: expressJoi.Joi.types.Number().required,
    latitude: expressJoi.Joi.types.Number().required,
  };

router.get('/', function (req, res) {
  Location.find(
    req.query,
    function (err, locations) {
      if (err) {
        return console.error(err);
      }
      console.log(req.params);
      res.send(locations);
    }
  );
});


router.get('/:_id', function (req, res) {
  Location
    .findOne({
      _id: req.params._id
    },
      function (err, location) {
        if (err) {
          return console.error(err);
        }
        if (location) {
          res.send(location);
        } else {
          var locationMessage = req.params._id + 'does not exists.';
          res.send({
            'status': '404 not found',
            'message': locationMessage
          });
        }
      });
});

router.delete('/:_id', function (req, res) {
  Location.remove({
    _id: req.params._id
  },
    function (err, location) {
      if (err) {
        return console.error(err);
      }
      if (location.result === 0) {
        res.send({
          success: true,
          message: 'No location with that ID found'
        });
      } else {
        res.send({
          success: true,
          message: 'Locations with ID deleted: ' + req.params._id
        });
      }
    });
});

router.patch('/:_id', function (req, res) {
  Location
    .findByIdAndUpdate(req.path.substring(1),
      req.body,
      function (err, location) {
        if (err) {
          return console.error(err);
        }
        res.send({
          success: true,
          message: 'Locations with ID UPDATED: ' + req.params._id,
          updatedLocation: location
        });
      });
});


router.post('/', expressJoi.joiValidate(validateLocation), function (req, res) {
  var location = new Location({
    longitude: req.query.longitude || 0,
    latitude: req.query.latitude || 0
  });
  location.save(function (err) {
    if (err) {
      return res.send({Error: err});
    }
    res.status(200)
      .send({
        saved: true,
        _id: location.id,
        object: location
      });
  });
});

// ===============Debug purposes only==================

router.delete('/', function (req, res) {
  Location.remove(function (err) {
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
