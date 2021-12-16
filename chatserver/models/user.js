const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Room = require("./room");
const Request = require("./request")

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    //display_name: { type : String, }
    password: {
        type: String,
        require: true,
        select: false,
        required: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        select: false,
        unique: true,
        required: true,
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
    friends: [
        {
            friend: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            room: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
            },
        },
    ],
    status: {
        type: Boolean,
        default: false,
    },
});

UserSchema.methods.setStatus = function (status) {
    var user = this;
    user.status = status;
    user.save(function (err) {
        if (err) console.log(err);
    });
};

// TODO: khi demo thi bat len
// UserSchema.pre('save', function (next) {
//     var user = this;
//     if (!user.isModified('password')) return next();
//     bcrypt.genSalt(10, function (err, salt) {
//         if (err) return next(err);
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);
//             user.password = hash;
//             next();
//         });
//     });
// });

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.createRoom = function (name, cb) {
    var user = this;
    Room.create(
        { name: name, owner: user._id, users: [user._id] },
        function (err, result) {
            if (err) {
                cb(err);
            } else {
                console.log(user.rooms);
                user.rooms.push(result._id);
                user.save(function (err) {
                    if (err) console.log(err);
                });
                cb(null, result);
            }
        }
    );
};

UserSchema.statics.getRoomsList = function (user, cb) {
    User.findOne({ username: user.username })
        .populate("rooms")
        .exec(function (err, result) {
            if (err || !result) {
                cb({ err: "Can't query" });
            } else {
                let response = [];
                for (let i = 0; i < result.rooms.length; i++) {
                    let temp = {};
                    temp.id = result.rooms[i]._id;
                    temp.name = result.rooms[i].name;
                    response.push(temp);
                }
                cb(null, response);
            }
        });
};



UserSchema.methods.joinRoom = function (room, cb) {
    var user = this;
    Room.findOne({ _id: room.id }, function (err, result) {
        if (err || !result) {
            cb({ err: "Can't query" });
        } else {
            if (result.isDirect) {
                cb({ status: "JoinDirect.", message: "This room is a direct one." });
            }
            else if (
                (result.users &&
                    result.users.find((element) => String(element) === String(user._id)))) {
                cb({ status: "Existed.", message: "User is on this room." });
            } else {
                result.users.push(user._id);
                user.rooms.push(result._id);
                result.save(function (err) {
                    if (err) console.log(err);
                });
                user.save(function (err) {
                    if (err) console.log(err);
                });
                cb(null, { status: "Success" });
            }
        }
    });
};

UserSchema.statics.search = function (term, cb) {
    User.find({ username: { $regex: ".*" + term + ".*" } }, (err, result) => {
        console.log(result);
        console.log(term);
        if (err || !result) {
            cb({ err: "Can't query" });
        } else {
            cb(null, result);
        }
    });
};



/* UserSchema.statics.addFriend = function (friend_id, cb) {
    var user = this;
    User.findById( friend_id, function (err, result) {
        if (err || !result) {
            cb({ err: "Can't query" });
        } else {
            if (
                user.friends &&
                user.friends.find(
                    (element) => String(element.friend) === String(result._id)
                )
            ) {
                cb({ status: "Existed.", message: "User is already friend." });
            } else {
                Room.create(
                    { isDirect: true, users: [user._id, result._id] },
                    (err, room) => {
                        if (err) {
                            console.log("error here");
                            cb(err);
                        } else {
                            result.friends.push({ friend: user._id, room: room._id });
                            user.friends.push({ friend: result._id, room: room._id });
                            result.save(function (err) {
                                if (err) console.log(err);
                            });
                            user.save(function (err) {
                                if (err) console.log(err);
                            });
                            cb(null, { status: "Success" });
                        }
                    }
                );
            }
        }
    });
}; */

UserSchema.statics.addFriend = function(users, cb) {
    User.findById(users.requester, (err, requester)=>{
        if (err || !requester) {
            cb({ err: "Can't query" });
        }else {
            User.findById(users.request_to, (err, request_to)=>{
                if (err || !requester) {
                    cb({ err: "Can't query" });
                }else {
                    Room.create( { isDirect: true, users: [requester._id, request_to._id] },
                        (err, room) => {
                            if (err) {
                                cb(err);
                            } else {
                                request_to.friends.push({ friend: requester._id, room: room._id });
                                requester.friends.push({ friend: request_to._id, room: room._id });
                                request_to.save(function (err) {
                                    if (err) console.log(err);
                                });
                                requester.save(function (err) {
                                    if (err) console.log(err);
                                });
                                cb(null, { status: "Success" });
                            }
                        }
                    );
                }
            })
        }
    })
}

UserSchema.statics.getDirectsList = function (user, cb) {
    User.findOne({ username: user.username })
        .populate("friends.room")
        .exec(function (err, result) {
            if (err || !result) {
                cb({ err: "Can't query" });
            } else {
                let response = [];
                for (let i = 0; i < result.friends.length; i++) {
                    let temp = {};
                    temp.id = result.friends[i].room._id;
                    temp.name = result.friends[i].room.name;
                    response.push(temp);
                }
                cb(null, result.friends);
            }
        });
};

UserSchema.methods.sendRequest = function (friend, cb) {
    var user = this;
    User.findOne({ username: friend.username }, (err, result) => {
        if (err || !result) {
            cb({ err: "Can't query" });
        } else {
            if (
                user.friends &&
                user.friends.find(
                    (element) => String(element.friend) === String(result._id)
                )
            ) {
                cb({ status: "Existed.", message: "User is already friend." });
            } else {
                // TODO: Request.findOne({request_to: user._id, requester: result._id}, )
                Request.create( {requester: user._id, request_to: result._id}, (err, result)=>{
                    if (err) cb(err);
                    else cb(null, result);
                })
            }
        }
    })
};


const User = mongoose.model("User", UserSchema);

module.exports = User;
