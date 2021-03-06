const express = require('express');
const User = require('../models/user');
const Request = require('../models/request');
const Message = require('../models/message');
const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
const router = express.Router();

router.post('/', auth.isAuthorized, function (req, res, next) {
    res.json(req.body.decoded);
});

router.post('/info', auth.isAuthorized, function(req, res, next) {
    User.findOne({username: req.body.username}, '+email', (err, result) => {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!"})
        } else {
            res.json(result)
        }
    })
})

router.post('/updateinfo', auth.isAuthorized, function(req, res, next) {
    User.findOne({username: req.body.username}, (err, result)=> {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!"})
        } else {
            if (typeof req.body.display_name != 'undefined'){
                result.display_name = req.body.display_name;
            }
            if (typeof req.body.avatar != 'undefined'){
                result.avatar = req.body.avatar;
            }
            result.save(function (err) {
                if (err) console.log(err);
            });
            res.json({status: "success"});
        }
    })
})

router.post('/register', function (req, res, next) {
    User.create(req.body, function (err, result) {
        if (err) //if error, return status: error, data: err
            res.status(500).json({ status: "error", data: err });
        else {  //if success, return username and email
            res.json({ status: "success", message: "User added successfully!!!", data: (({ username, email }) => ({ username, email }))(result) });
        }
    });
})

router.post('/login', function (req, res, next) {
    User.findOne({ username: req.body.username }, 'password', function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            result.comparePassword(req.body.password, function (err2, isMatch) {
                if (err2 || !isMatch)
                    res.status(500).json({ status: "error", message: "Mismatch", data: req.body.username });
                else {
                    let token = jwt.sign({username: req.body.username, _id: result._id }, process.env.SECRET);
                    res.json({ status: "success", data: {username: req.body.username, jwt: token} });
                }
            })
        }
    })
})

router.post('/rooms', auth.isAuthorized, function (req, res, next) {
    User.getRoomsList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/createroom', auth.isAuthorized, (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err || !user) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            user.createRoom( {name: req.body.roomname}, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    if (req.body.members) {
                        user.addListIntoGroup({room_id: result._id, members: req.body.members}, (err, result)=>{
                        })
                    }
                    res.json(result);
                }
            })
        }
    })
})

router.post('/joinroom', auth.isAuthorized, (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            result.joinRoom( {id: req.body.room_id}, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/find', auth.isAuthorized, (req, res, next)=>{
    if (req.body.term == '') {
        res.json([]);
        return;
    }
    User.findOne({username: req.body.username}, (err, result)=>{
        if (err) {
            res.status(500).json(err);
        } else {
            User.search({...req.body, _id: result._id}, (err, result)=>{
                if (err) {
                    res.json([]);
                } else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/acceptrequest', auth.isAuthorized, (req, res, next)=> {
    Request.findById( req.body.request_id, function (err, request) {
        if (err || !request) {
            res.status(500).json({ status: "error", message: "Not found!" });
        }
        else {
            User.addFriend( {requester: request.requester, request_to: request.request_to}, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    request.remove(); 
                    res.json(result);
                }
            })
        }
    })
})

router.post('/directs', auth.isAuthorized, function (req, res, next) {
    User.getDirectsList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/sendrequest', auth.isAuthorized, (req, res, next)=> {
    User.findOne( { username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            result.sendRequest( {username: req.body.friendname}, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/inrequest', auth.isAuthorized, (req, res, next)=>{
    User.findOne( { username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            Request.inRequest( result._id, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/outrequest', auth.isAuthorized, (req, res, next)=>{
    User.findOne( { username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            Request.outRequest( result._id, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/pinmessage', auth.isAuthorized, (req,res,next) => {
    User.findOne( { username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            User.pinMessage({room_id: req.body.room_id, message_id: req.body.message_id } ,(err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/unpin', auth.isAuthorized, (req,res,next) => {
    User.findOne( { username: req.body.username }, function (err, result) {
    if (err || !result) {
        res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
    }
    else {
        User.unPin({room_id: req.body.room_id, message_id: req.body.message_id } ,(err, result) => {
            if (err) {
                res.status(500).json(err);
            }
            else {
                res.json(result);
            }
        })
    }
})
})

router.post('/addtogroup', auth.isAuthorized, (req, res, next)=>{
    User.findOne( { username: req.body.username }, function (err, result) {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            result.addListIntoGroup({username: req.body.username, room_id: req.body.room_id, members: req.body.members}, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.json(result);
                }
            })
        }
    })
})

    router.post('/deleteMessage', auth.isAuthorized, (req,res,next)=> {
        Message.findById(req.body.message_id , (err,result)=>{
            if(err || !result) {
                res.status(500).json({ status: "error", message: "Not found!"});
            }
            else{
                Room.findById(result.room, (err, result1) => {
                    if(err || !result) {
                    res.status(500).json({ status: "error", message: "Room not found!"});
                    }else{
                        result1.pinMessages.pull({_id: result._id});
                        result1.messages.pull({_id: result._id });
                        result1.save();
                    }
                });
                result.remove();
                res.json({status: "Success"});
            }
        })   
    });


    router.post('/reactMessage', auth.isAuthorized, (req,res,next) => {
        Message.findById(req.body.message_id).exec(function (err, result){
            if ( err || !result ){
                res.status(500).json({status: "error", message: "Not found!"});
            }else{
                // T??m react ???? xem ???? react ch??a
                for ( let i = 0; i <result.react.length; i++){
                if ( String(result.react[i].user) == req.body.user_id) {
                    if (result.react[i].icon == req.body.icon) {
                        result.react[i].remove();
                        result.save();
                        res.json({status:"Remove Success"});
                        return;
                    } else {
                        result.react[i].icon = req.body.icon;
                        result.save();
                        res.json({status:"Change Success"});
                        return;
                    }
                }
            }
            result.react.push({user: req.body.user_id, icon: req.body.icon});
            result.save();
            res.json({status: "Add Success"});
            return;
            }
        })
    })

router.post('/changepassword', auth.isAuthorized, (req, res, next) => {
    User.findOne({ username: req.body.username }, 'password', function (err, user) {
        if (err || !user) {
            res.status(500).json({ status: "error", message: "Not found!", data: req.body.username });
        }
        else {
            user.comparePassword(req.body.oldpassword, function (err, isMatch) {
                if (err || !isMatch)
                    res.status(500).json({ status: "error", message: "Mismatch", data: req.body.username });
                else {
                    user.password = req.body.newpassword
                    user.save((err)=>{
                        if(err) res.status(500).json({ status: "error", message:"internal error"})
                        else res.json({status: 'success'})
                    })
                }
            })
        }
    })
})

module.exports = router;
