const express = require('express');
const User = require('../models/user');
const Request = require('../models/request')
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
const router = express.Router();
/* GET users listing. */
router.post('/', auth.isAuthorized, function (req, res, next) {
    res.json({username: req.body.decoded.username});
});

router.post('/info', function(req, res, next) {
    User.findOne({username: req.body.username}, '+email', (err, result) => {
        if (err || !result) {
            res.status(500).json({ status: "error", message: "Not found!"})
        } else {
            res.json(result)
        }
    })
})

router.post('/updateinfo', function(req, res, next) {
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
                    let token = jwt.sign({username: req.body.username, _id: result._id }, process.env.SECRET, {expiresIn: '1d'});
                    res.json({ status: "success", data: {username: req.body.username, jwt: token} });
                }
            })
        }
    })
})

router.post('/rooms', function (req, res, next) {
    User.getRoomsList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/createroom', (req, res, next) => {
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
                            res.json(result);
                        })
                    }
                    else {
                        res.json(result);
                    }
                }
            })
        }
    })
})

router.post('/joinroom', (req, res, next) => {
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

router.post('/find', (req, res, next)=>{
    User.findOne({username: req.body.username}, (err, result)=>{
        if (err) {
            res.status(500).json(err);
        } else {
            User.search({...req.body, _id: result._id}, (err, result)=>{
                if (err) {
                } else {
                    res.json(result);
                }
            })
        }
    })
})

router.post('/acceptrequest', (req, res, next)=> {
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

router.post('/directs', function (req, res, next) {
    User.getDirectsList(req.body, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
    })
})

router.post('/sendrequest', (req, res, next)=> {
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

router.post('/inrequest', (req, res, next)=>{
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

router.post('/outrequest', (req, res, next)=>{
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


router.post('/pinmessage', (req,res,next) => {
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

/*
    router.post('/unpin', (req,res,next) => {
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

 */
module.exports = router;
