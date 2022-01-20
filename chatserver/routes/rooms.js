const express = require('express');
const User = require('../models/user');
const Room = require('../models/room')
const Message = require('../models/message')
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

router.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({filename: req.file.filename});
})

router.get('/download', auth.isAuthorized, (req, res, next)=>{
    Message.findById(req.query.id).populate({
        path: "room",
        populate: [{ path: "users" }],
      }).exec((err, result)=>{
        if (err || !result) {
            res.json("File not found.")
        } else {
            console.log(result.room.users, req.body.decoded.username)
            if (result.room.users.find((element)=>{
                return element.username == req.body.decoded.username
            })) {
                res.download('./uploads/'+result.file.data, result.file.filename);
            } else {
                res.json("Who are you?")
            }
        }
    })
})

module.exports = router;