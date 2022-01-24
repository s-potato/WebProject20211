const express = require('express');
const User = require('../models/user');
const Room = require('../models/room')
const Message = require('../models/message')
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
var upload = require('../util/upload')
var md5 = require('md5')
const router = express.Router();

router.post('/messages', auth.isAuthorized, function (req, res, next) {
    Room.getMessagesList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/members', auth.isAuthorized, function (req, res, next) {
    Room.getMembersList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/pins', auth.isAuthorized, function(req,res,next) {
    Room.getPinList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/upload', auth.isAuthorized, upload.single('file'), (req, res, next) => {
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

router.post('/refreshKey', (req, res, next)=>{
    Room.findById(req.body.id, (err, room)=>{
        if (err || !room) {
            res.status(500).json({ status: "error", message: "Not found room!"})
        } else {
            room.joinKey = md5(Date.now()+room.id);
            room.save((err)=>{
                if (err) res.status(500).json({ status: "error", message: "internal error"})
                else res.json(room.joinKey)
            })
        }
    })
})

router.post('/joinwithkey', (req, res, next)=>{
    Room.findOne({joinKey: req.body.key}, (err, room)=>{
        if (err || !room) {
            res.status(500).json({ status: "error", message: "Wrong key"})
        } else if (room.isDirect){
            res.status(500).json({ status: "error", message: "Where did you get that key?"})
        } else {
            User.addToGroup({username: req.body.username, room_id: room._id}, (err, result)=>{
                if (err) {
                    res.status(500).json(err)
                } else {
                    res.json({status: 'success'})
                }
            })
        }
    })
})

router.get('/key', (req, res, next)=>{
    Room.findById(req.query.id, (err, room)=>{
        if (err || !room || room.isDirect) {
            res.status(500).json({ status: "error", message: "Room not found."})
        } else {
            res.json(room.joinKey);
        }
    })
})

router.post('/search', (req, res, next)=>{
    if (req.body.term == '') {
        res.json([]);
        return;
    }
    Room.search(req.body, (err, result)=>{
        if(err){
            res.json([]);
        }
        else {
            res.json(result);
        }
    })
})
module.exports = router;