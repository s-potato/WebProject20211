const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/user');


module.exports = function () {
    user1 = new User({
        username: "chutiendat",
        password: "giotmuabuon",
        email: "chudat",
    })

    User.create(user1);
    

    user2 = new User({
        username: "Anh",
        password: "potato",
        email: "potato"
    })
    User.create(user2);


    user1.createRoom("Rap Xiec", function (err, result) {
        if (err) console.log(err)
        else {
            result.populate('users').run((err, docs) => {
                if(err) console.log(err)
                else console.log(docs);
            })
        };
    })


    
}
