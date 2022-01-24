const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (req, res, next) => {
    var token;
    if (req.body.jwt) {
        token = req.body.jwt;
    } else if (req.query.jwt) {
        token = req.query.jwt;
    } else {
        return next({err: "no token"})
    }
    console.log(token);
    jwt.verify(token, process.env.SECRET, function (err, data) {
        if (err) {
            return next(err);
        } else {
            req.body.decoded = data;
            return next();
        }
    })
}
