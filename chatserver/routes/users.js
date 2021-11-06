const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
    res.send(UserModel.createUser(req.body));
})

module.exports = router;
