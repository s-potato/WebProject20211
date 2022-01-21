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

router.post('/outgroup', function (req, res, next) {
    Room.findById(req.body.id, (err,result) => {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found room!"})
        } else {
            User.findOne( { username: req.body.username}, function (err, result1) {
                if (err || !result) {
                    res.status(500).json({ status: "error", message: "Not found user!"})
                } else {
                    result.users.pull({_id: result1._id})
                    result1.rooms.pull({_id: req.body.id})
                    result1.save();
                    result.save();
                    res.json({status: "Success"}); 
                }               
            })
        }
    })
})
module.exports = router;