const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/user');
const Request = require('../models/request')


module.exports = function () {
    // User.findOne({username: "chutiendat"}, (err, result) => {
    //     if (!err) result.setStatus(true)
    // });
    var user1 = User.findOne({username: "chutiendat"});
    var user2 = User.findOne({username: "hieu"});
    var request = Request.find({requester: user1._id, request_to: user2._id});
    //request.exec();
    console.log(request.exec())
}
