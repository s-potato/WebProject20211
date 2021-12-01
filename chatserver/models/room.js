const mongoose = require('mongoose');
const Message = require('./message');
const User = require('./user');

var RoomSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, unique: true },
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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

RoomSchema.statics.getMembersList = function (room, cb) {
    Room.findOne({ name: room.name }).populate('users').exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            cb(null, result.users);
        }
    })
}

RoomSchema.statics.getMessagesList = function (room, cb) {
    Room.findOne({ name: room.name }).populate('messages').exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            cb(null, result.messages);
        }
    })
}

RoomSchema.statics.addMessage = function (room, user, message, cb) {
    Room.findOne({ name: room.name }).exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            room = result;
            User.findOne({ username: user.username }).exec(function (err, result) {
                if (err || !result) {cb({err: "Can't query"})}
                else {
                    user = result;
                    Message.create({ room: room._id, sender: user._id, content: message.body }, function (err, result) {
                        if (err) { cb(err) }
                        else {
                            cb(null, result);
                        }
                    })
                } F
            })
        }
    })
}

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;