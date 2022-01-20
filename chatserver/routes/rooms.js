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

router.get('/download', (req, res, next)=>{
    console.log(req);
    Message.findById(req.query.id, (err, result)=>{
        if (err || !result) {
            res.render("File not found.")
        } else {
            res.download('./uploads/'+result.file.data, result.file.filename);
        }
    })
})

module.exports = router;