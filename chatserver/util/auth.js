const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (req, res, next) => {
    jwt.verify(req.body.jwt, process.env.SECRET, function (err, data) {
        if (err) {
            return next(err);
        }
        req.body.decoded = data;
        return next();
    })
}
