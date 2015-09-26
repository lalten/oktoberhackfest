/*jslint node: true, indent: 2,nomen:true */
'use strict';
var express = require('express'),
  router = express.Router(),
  Location = require('../models/locations');

router.get('/', function (req, res) {
  Location.find(
    req.query,
    function (err, locations) {
      if (err) {
        return res.json(err);
      }
      res.send(locations);
    }
  );
});

router.get('/distance/:_id', function (req, res) {

  var coords = [],
    folder = Location
      .findOne(
        req.query._id
      );
  coords[0] = req.query.longitude;
  coords[1] = req.query.latitude;

});
router.get('/closest', function (req, res) {
  var limit = req.query.limit || 10,
    maxDistance = (req.query.distance || 8) / 6371, //max distance in radians
    coords = [];

  coords[0] = req.query.longitude;
  coords[1] = req.query.latitude;

  Location
    .find({
      loc: {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).limit(limit).exec(function (err, locations) {
      if (err) {
        return res.json(500, err);
      }
      res.json(200, locations);
    });
});

router.get('/:_id', function (req, res) {
  Location
    .findOne({
      _id: req.params._id
    },
      function (err, location) {
        if (err) {
          return res.json(err);
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
        return res.json(err);
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
          return res.json(err);
        }
        res.send({
          success: true,
          message: 'Locations with ID UPDATED: ' + req.params._id,
          updatedLocation: location
        });
      });
});


router.post('/', function (req, res) {
  console.log(req.body.longitude);
  if (!isNaN(req.query.longitude) || !isNaN(req.query.latitude)) { res.json("error"); }
  var location = new Location({
    loc: [
      req.body.longitude || 0,
      req.body.latitude || 0
    ]
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
      return res.json(err);
    }
    res.send({
      succes: true,
      message: 'Everything was deleted'
    });
  });
});

module.exports = router;
