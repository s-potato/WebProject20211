const mongoose = require('mongoose');

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

/* RoomSchema.methods.createRoom = function(name, cb) {
   Room.create({name: name, owner: this._id, users: [this._id]}, function(err, result) {
        if (err) cb(err);
       cb(null, result);
    })
} */


RoomSchema.methods.getMembersList = function(){
    return this.populate('users').users;
}

RoomSchema.methods.getMessagesList = function() {
    return this.populate("messages").messages;
}

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;