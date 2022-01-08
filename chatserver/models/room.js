const mongoose = require('mongoose');
const Message = require('./message');
const User = require('./user');

var RoomSchema = new mongoose.Schema({
    name: { type: String, lowercase: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    isDirect: {type: Boolean , default : false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

RoomSchema.pre("save", function(next){
    if (this.isModified("messages")) {
        this.updated_at = Date.now();
        next();
    }
})

RoomSchema.statics.getMembersList = function (room, cb) {
    Room.findById(room.id).populate('users').exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            let response = [];
            for (let i = 0; i < result.users.length; i++) {
                let temp = {};
                temp.username = result.users[i].username;
                temp.status = result.users[i].status;
                response.push(temp);
            }
            cb(null, response);
        }
    })
}

RoomSchema.statics.getMessagesList = function (room, cb) {
    Room.findById(room.id).populate({path: 'messages', populate: [
        { path: 'sender' },
        { path: 'room' }
    ]}).exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            let response = [];
            for (let i = 0; i < result.messages.length; i++) {
                let temp = {};
                temp._id = result.messages[i]._id;
                temp.room = result.messages[i].room.name;
                temp.type = result.messages[i].type;
                if (temp.type === "text") {
                    temp.message = result.messages[i].content;
                } else {
                    temp.file = result.messages[i].file;
                }
                temp.sender = result.messages[i].sender.username;
                temp.date = result.messages[i].created_at.getTime();
                response.push(temp);
            }
            cb(null, response);
        }
    })
}

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;