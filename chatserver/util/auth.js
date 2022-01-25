const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports.isAuthorized = (req, res, next) => {
    var token;
    if (req.body.jwt) {
        token = req.body.jwt;
    } else if (req.query.jwt) {
        token = req.query.jwt;
    } else {
        return next({status: 401, err: "no token"})
    }
    jwt.verify(token, process.env.SECRET, function (err, data) {
        if (err) {
            return next({...err, status: 401});
        } else {
            User.findOne({username: data.username}, (err, result)=>{
                if (err || !result) {
                    return next({status: 401, err: "user not found"});
                } else {
                    req.body.decoded = data;
                    return next();
                }
            })
        }
    })
}
