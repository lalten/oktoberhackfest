/*jslint node: true, indent: 2,nomen:true */
'use strict';
var express = require('express'),
  router = express.Router(),
  User = require('../models/users'),
  expressJoi = require('express-joi'),
  validateUser = {
    fname: expressJoi.Joi.types.String().min(2).max(30).required(),
    lname: expressJoi.Joi.types.String().min(5).max(30).required(),
    password: expressJoi.Joi.types.String().min(8).max(30).required()
  };

router.get('/', function (req, res) {
  User.find(
    req.query,
    function (err, users) {
      if (err) {
        return console.error(err);
      }
      console.log(req.params);
      res.send(users);
    }
  );
});


router.get('/:_id', function (req, res) {
  User
    .findOne({
      _id: req.params._id
    },
      function (err, user) {
        if (err) {
          return console.error(err);
        }
        if (user) {
          res.send(user);
        } else {
          var userMessage = req.params._id + 'does not exists.';
          res.send({
            'status': '404 not found',
            'message': userMessage
          });
        }
      });
});

router.delete('/:_id', function (req, res) {
  User.remove({
    _id: req.params._id
  },
    function (err, user) {
      if (err) {
        return console.error(err);
      }
      if (user.result === 0) {
        res.send({
          success: true,
          message: 'No user with that ID found'
        });
      } else {
        res.send({
          success: true,
          message: 'Users with ID deleted: ' + req.params._id
        });
      }
    });
});

router.patch('/:_id', function (req, res) {
  User
    .findByIdAndUpdate(req.path.substring(1),
      req.body,
      function (err, user) {
        if (err) {
          return console.error(err);
        }
        res.send({
          success: true,
          message: 'Users with ID UPDATED: ' + req.params._id,
          updatedUser: user
        });
      });
});


router.post('/', expressJoi.joiValidate(validateUser), function (req, res) {
  var user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    password: req.body.password,
  });
  user.save(function (err) {
    if (err) {
      return res.send({Error: err});
    }
    res.status(200)
      .send({
        saved: true,
        _id: user.id,
        object: user
      });
  });
});

// ===============Debug purposes only==================

router.delete('/', function (req, res) {
  User.remove(function (err) {
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
