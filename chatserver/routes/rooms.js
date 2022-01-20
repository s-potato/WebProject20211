const express = require('express');
const User = require('../models/user');
const Room = require('../models/room')
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
var upload = require('../util/upload')
const router = express.Router();

router.post('/messages', function (req, res, next) {
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
    Room.getMembersList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/pins',function(req,res,next) {
    Room.getPinList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/upload', upload.single('file'), (req, res, next)=> {
    res.json("uploaded");
  })

router.post('/updateinfo', function (req, res, next) {
    Room.findById(req.body.id, (err,result) => {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!"})
        } else {
            if (typeof req.body.groupname != 'undefined'){
                result.name = req.body.groupname;
            }
            if (typeof req.body.avatar != 'undefined'){
                result.avatar = req.body.avatar;
            }
            result.save(function (err) {
                if (err) console.log(err);
            })
            res.json({status: "Success"});
        }
    })
})
module.exports = router;