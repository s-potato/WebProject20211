const express = require('express');
const User = require('../models/user');
const Room = require('../models/room')
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
const router = express.Router();

router.get('/messages', function (req, res, next) {
    Room.getMessagesList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/members', function (req, res, next) {
    console.log(req.body);
    Room.getMembersList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

module.exports = router;