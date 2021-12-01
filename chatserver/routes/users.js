const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../util/auth');
const router = express.Router();
/* GET users listing. */
router.post('/', auth.isAuthorized, function (req, res, next) {
    res.json({username: req.body.decoded.username});
});

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
                if (err2)
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

module.exports = router;
