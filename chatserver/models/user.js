const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Room = require('./room');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        require: true,
        select: false,
        required: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
})

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.getRoomList = function(cb) {
    cb(this.populate('rooms').rooms);
}

UserSchema.methods.joinRoom = function(room_id, cb) {
    Room.findOne({_id: room_id}, function(err, result){
        if (err) cb(err);
        if (result.users.find(this_id)) cb({status: "Existed.", message: "User is on this room."});
        result.users.push(this._id);
        this.rooms.push(result._id);
        cb(null, {status: "Success"});
    })
}

const User = mongoose.model("User", UserSchema);

module.exports = User;