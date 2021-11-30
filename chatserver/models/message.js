const mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    created_at: { type: Date, default: Date.now },
});

var Message = mongoose.model("Message", MessageSchema);

module.exports = Message;