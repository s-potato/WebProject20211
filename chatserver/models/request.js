const mongoose = require('mongoose')

var RequestSchema = mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    request_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: { type: Date, default: Date.now }
});

RequestSchema.index({ requester: 1, request_to: 1 }, { unique: true });

RequestSchema.statics.inRequest = function(user_id, cb){
    Request.find({request_to: user_id}).populate('requester', 'username display_name avatar').exec((err, result) => {
        if (err || !result) cb(err)
        else {
            cb(null, result);
        }
    })
}
// get in request va get out request

RequestSchema.statics.outRequest = function(user_id, cb){
    Request.find({requester: user_id}).populate('request_to', 'username').exec((err,result) => {
        if (err || !result) {cb({err: "Can't query"})}
        else{
            cb(null, result);
        }
    })
}

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;