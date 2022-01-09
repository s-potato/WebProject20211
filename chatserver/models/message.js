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
    type: {
        type: String,
        default: "text"
    },
    content: String,
    file: {
        data: String,
        filename: String
    },
    created_at: { type: Date, default: Date.now },
});

var Message = mongoose.model("Message", MessageSchema);

module.exports = Message;