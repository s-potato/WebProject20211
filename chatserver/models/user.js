const mongoose = require('mongoose');

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
    }
})

UserSchema.statics.createUser = function(user){
    return this.create(user);
}

const user = mongoose.model("User", UserSchema);

module.exports = user;