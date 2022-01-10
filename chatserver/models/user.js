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
    display_name: { type : String
    },
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
    avatar: String
});

UserSchema.methods.setStatus = function (status) {
    var user = this;
    user.status = status;
    user.save(function (err) {
        if (err) console.log(err);
    });
};

// TODO: khi demo thi bat len
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.display_name || user.display_name == ''){
        user.display_name = user.username
    }
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.createRoom = function (data, cb) {
    var user = this;
    Room.create(
        { name: data.name, owner: user._id, users: [user._id] },
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

UserSchema.methods.addListIntoGroup = function(data, cb){
    Room.findById(data.room_id , (err, result) => {
        if (err || !result) {
            cb({ err: "Can't query" });
        }else{ 
            for (let i =0 ; i < data.members.length; i++)
            {
                User.addToGroup({room_id: result._id, username: data.members[i].username}, (err, result) => 
                {
                    if (err) cb(err);
                    else cb(result);
                })
            }
        }
    })
}

UserSchema.statics.addToGroup = function(data, cb) {
    Room.findById(data.room_id , (err, result) => {
        if (err || !result) {
            cb({ err: "Can't query" });
        }else{
            User.findOne({username: data.username}, (err, user)=>{
                user.rooms.push(result._id);
                result.users.push(user._id);
                result.save(function (err) {
                    if (err) console.log(err);
                });
                user.save(function (err) {
                    if (err) console.log(err);
                });
                cb(null, { status: "Success" });
            })
        }
    })
}

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


    UserSchema.statics.pinMessage = function(data,cb){
        Room.findById(data.room_id, (err, result) => {
            if (err || !result) {
            cb({ err: "Can't query" });
        }else{
            Message.findById(data.message_id , (err,message) =>{
                result.pinMessages.push(message);
                result.save( function (err) {
                    if (err) console.log(err);
                });
                cb(null, { status: "Success" });
            })
        }
        })        
    }

/* UserSchema.statics.pinMessage = function (message, cb){
    Message.findOne({_id: message.id} , function(err, result){
        if (err || !result) {
            cb({ err: "Can't query" });
        } else{
            if (!result.isPin) {
                result.isPin = true;
                cb(null, { status: "Success" });
            }else{
                cb({ status: "Existed.", message: "Message is already pinned!" });
            }
        }
    })
} 

UserSchema.statics.unpinMessage = function (message, cb){
    Message.findOne({_id: message.id} , function(err, result){
        if (err || !result) {
            cb({ err: "Can't query" });
        } else{
            if (result.isPin) {
                result.isPin = false;
                cb(null, { status: "Success" });
            }else{
                cb({ status: "Cann't unpinned.", message: "Message is not pinned!" });
            }
        }
    })
} */
/*
    getPinlist -> room.js
 */
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


UserSchema.statics.search = function (params, cb) {
    User.find({ username: { $regex: ".*" + params.term + ".*" } })
    .where('username').ne(params.username)
    .populate("friends.friend", "username").select("_id username").exec((err, result) => {
        if (err || !result) {
            cb({ err: "Can't query" });
        } else {
            let data = []
            Request.find({requester: params._id}).exec((err, requests)=> {
                result.forEach(function(element){
                    let eleobj = element.toObject();
                    if (eleobj.friends && eleobj.friends.find((ele) =>  ele.friend.username == params.username)){
                        eleobj.isFriend = true;
                        eleobj.isRequested = true;
                    } else {
                        if (requests && requests.find((element) => String(element.request_to) === String(eleobj._id))) {
                            eleobj.isRequested = true;
                        } else {
                            eleobj.isRequested = false;
                        }
                        eleobj.isFriend = false;
                    }
                    delete eleobj.friends;
                    console.log(eleobj);
                    data.push(eleobj);
                })
                cb(null, data);
            })
            
        }
    });
};

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
                                cb(null, { status: "Success", message: "Friend added successfully!" });
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
        .populate("friends.room", "isDirect").populate("friends.friend", "username status")
        .exec(function (err, result) {
            if (err || !result) {
                cb({ err: "Can't query" });
            } else {
                let response = [];
                for (let i = 0; i < result.friends.length; i++) {
                    let temp = {};
                    temp.username = result.friends[i].friend.username;
                    temp.id = result.friends[i].room._id;
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
                Request.findOne({request_to: user._id, requester: result._id}, (err, request)=>{
                    if(err) cb(err);
                    else if (!request) {
                        Request.create( {requester: user._id, request_to: result._id}, (err, result)=>{
                            if (err) cb(err);
                            else cb(null, result);
                        })
                    }
                    else {
                        User.addFriend( {requester: request.requester, request_to: request.request_to}, (err, result) => {
                            if (err) {
                                cb(err);
                            }
                            else {
                                request.remove(); 
                                cb(null, result);
                            }
                        })
                    }
                })
            }
        }
    })
};


const User = mongoose.model("User", UserSchema);

module.exports = User;
