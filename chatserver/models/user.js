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
    //display_name: { type : String, }
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
        select: false,
        unique: true,
        required: true
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    friends: [{
        friend: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    }],
    status: {
        type: Boolean,
        default: false
    }
})

UserSchema.methods.setStatus = function(status) {
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
    Room.create({ name: name, owner: user._id, users: [user._id] }, function (err, result) {
        if (err) {cb(err)}
        else {
            console.log(user.rooms);
            user.rooms.push(result._id);
            user.save(function (err) {
                if (err) console.log(err);
            });
            cb(null, result);
        }
    })
}
//UserSchema.methods.getName = function (id, cb) {
//User.findOne({ id: user._id }).exec(function (err, result) {
//    if (err || !result) {cb({err: "Can't query"})}
//    else {
//        cb(null, result.username);
//    }
//})
//}

UserSchema.statics.getRoomsList = function (user, cb) {
    User.findOne({ username: user.username, isDirect: false }).populate('rooms').exec(function (err, result) {
        if (err || !result) {cb({err: "Can't query"})}
        else {
            let response = [];
            for (let i = 0; i < result.rooms.length; i++) {
                let temp = {};
                temp.id = result.rooms[i]._id;
                temp.name = result.rooms[i].name;
                response.push(temp);
            }
            cb(null, response);
        }
    })
}

UserSchema.methods.joinRoom = function (room, cb) {
    var user = this;
    Room.findOne( { _id: room.id}, function (err, result) {
        if (err || !result) { cb({err: "Can't query"}) }
        else {
            if (result.users && result.users.find((element) => (String(element) === String(user._id))) ) {
                cb({ status: "Existed.", message: "User is on this room." });
            }
            else {
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
    })
}


const User = mongoose.model("User", UserSchema);

module.exports = User;