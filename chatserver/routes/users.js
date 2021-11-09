const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
    UserModel.create(req.body, function (err, result) {
        if (err) //if error, return status: error, data: err
            res.status(500).json({ status: "error", data: err });
        else {  //if success, return username and email
            res.json({ status: "success", message: "User added successfully!!!", data: (({ username, email }) => ({ username, email }))(result) });
        }
    });
})

router.post('/login', function(req, res, next) {
    
})

module.exports = router;
