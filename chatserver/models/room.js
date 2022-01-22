const mongoose = require("mongoose");
const Message = require("./message");
var md5 = require('md5')
const User = require("./user");

var RoomSchema = new mongoose.Schema({
  name: { type: String, lowercase: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  pinMessages: [
     {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Message",
     }
  ],
  isDirect: { type: Boolean, default: false },
  joinKey: {
    type: String,
    unique: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  avatar : String
});

RoomSchema.pre("save", function (next) {
  if (!this.joinKey) {
    this.joinKey = md5(Date.now() + this._id)
  }
  if (this.isModified("messages")) {
    this.updated_at = Date.now();
    next();
  }
  return next();
});

RoomSchema.statics.getMembersList = function (room, cb) {
  Room.findById(room.id)
    .populate("users")
    .exec(function (err, result) {
      if (err || !result) {
        cb({ err: "Can't query" });
      } else {
        let response = [];
        for (let i = 0; i < result.users.length; i++) {
          let temp = {};
          temp.display_name = result.users[i].display_name;
          if (result.users[i].avatar) {
            temp.avatar = result.users[i].avatar;
          }
          temp.username = result.users[i].username;
          temp.id = result.users[i].id;
          temp.status = result.users[i].status;
          response.push(temp);
        }
        cb(null, response);
      }
    });
};

RoomSchema.statics.getMessagesList = function (room, cb) {
  Room.findById(room.id)
    .populate({
      path: "messages",
      populate: [{ path: "sender" }, { path: "room" }, { path: "react.user", select: '_id username'}],
    })
    .exec(function (err, result) {
      if (err || !result) {
        cb({ err: "Can't query" });
      } else {
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
          temp.react = result.messages[i].react
          response.push(temp);
        }
        cb(null, response);
      }
    });
};


RoomSchema.statics.getPinList =  function (room,cb ){
  Room.findById(room.id).populate("pinMessages").exec( async function(err,result){
      if (err || !result) {
          cb({ err: "Can't query" });
      }else {
        if ( result.pinMessages.length == 0 ){
            cb(null , {status: "List empty"});
        }else {
          let response = [];
            for ( let i = 0; i < result.pinMessages.length; i++){
              let temp = {};
              await Message.findById(result.pinMessages[i]._id , (err, message) => {
                if(err || !message){
                  cb({ err: "Can't query" });
                }else{
                  temp.id = message._id;
                  temp.sender = message.sender;
                  temp.type = message.type;
                  if( message.type == "text"){
                    temp.content = message.content;
                  }else{
                    temp.file = message.file;
                  }
                  temp.created_at = message.created_at;
                  response.push(temp);
                }
              }).clone().catch(function(err){ console.log(err)})                  
          }
          cb(null,response);
      }
    }
  })
}

RoomSchema.statics.search = function(params, cb) {
  Message.find({content: { $regex: ".*" + params.term + ".*" }, type: 'text', room: params.room_id})
  .populate("sender").exec((err, result)=>{
    if (err || !result) {
      cb({ err: "Can't query" });
    } else {
      let response = [];
      for (let i = 0; i < result.length; i++) {
        let temp = {};
        temp._id = result[i]._id;
        temp.message = result[i].content;
        temp.sender = result[i].sender.display_name;
        temp.date = result[i].created_at.getTime();
        response.push(temp);
      }
      cb(null, response);
    }
  })
}



const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
