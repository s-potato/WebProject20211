const Room = require("./models/room");
const User = require("./models/user");
const Message = require("./models/message");

function addMessage(room, user, message, type, reply_to, cb) {
  User.findOne({ username: user.username }, function (err, result) {
    if (err || !result) { cb({ err: "Can't query user" }) }
    else {
      user = result;
      Room.findById(room.room_id, function (err2, result2) {
        if (err2 || !result2) { cb({ err: "Can't query room" }) }
        else {
          room = result2;
          if (type === "text") {
            Message.create({ room: room._id, sender: user._id, content: message.body}, function (err3, result3) {
              if (err3) { cb(err3) }
              else {
                if (reply_to) {
                  result3.reply_to = reply_to._id;
                  result3.save(function (err) {
                    if (err) console.log(err);
                  });
                }
                room.messages.push(result3._id);
                room.save(function (err) {
                  if (err) console.log(err);
                });
                cb(null, result3);
              }
            })
          } else {
            Message.create({ room: room._id, sender: user._id, file: message.body, type: type }, function (err3, result3) {
              if (err3) { cb(err3) }
              else {
                if (reply_to) {
                  result3.reply_to = reply_to._id;
                  result3.save(function (err) {
                    if (err) console.log(err);
                  });
                }
                room.messages.push(result3._id);
                room.save(function (err) {
                  if (err) console.log(err);
                });
                cb(null, result3);
              }
            })
          }
        }
      })
    }
  })
}
module.exports = (io) => {
  io.on("connection", (socket) => {
    var username;
    //socket.emit("connection");
    socket.on("userconnected", (data) => {
      username = data.username;
      console.log(username + " connected.");
      socket.join(String(username)); //
      User.findOne({ username: data.username }, (err, result) => {
        if (!err && result) {
          result.status = true;
          result.save(function (err) {
            if (err) console.log(err);
          });
        }
      })
      User.getDirectsList({ username: data.username }, (err, result) => {
        if (!err && result) {
          for (friend of result) {
            socket.join(String(friend.room._id));
          }
        }
      })
      User.getRoomsList({ username: data.username }, (err, result) => {
        if (!err && result) {
          for (group of result) {
            socket.join(String(group.id));
          }
        }
      })
    })


    socket.on('disconnect', () => {
      User.findOne({ username: username }, (err, result) => {
        if (!err && result) {
          result.status = false;
          result.save(function (err) {
            if (err) console.log(err);
          });
          console.log(username + " disconnected");
        }
      })
    });

    socket.on("chat message", (data) => {
      addMessage({ room_id: data.room_id }, { username: data.sender }, { body: data.message }, "text", data.reply_to, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          data._id = result._id;
          data.date = Date.now();
          io.to(data.room_id).emit("response", data);
          /*update room.update at
          
          */
        }
      });
    });

    socket.on("file message", (data) => {
      addMessage({ room_id: data.room_id }, { username: data.sender }, { body: data.file }, data.type, data.reply_to, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          data._id = result._id;
          data.date = Date.now();
          io.to(data.room_id).emit("response", data);
        }
      });
    });

    socket.on("Pin message", (data) => {
      io.to(data.room_id).emit("A message pinned",(data));
    });

    
      socket.on("Unpin message", (data) => {
        io.to(data.room_id).emit("Unpinned a message",(data));
     });
    

    

    socket.on("Add member",(data) =>{
      io.to(data.room_id).emit("A member added", {room_id: data.room_id}); // refresh group
      data.members.forEach(member =>{
        io.to(member.username).emit("Join room", {room_id: data.room_id})
      })
    })

    socket.on("Joined room", (data) => {
      socket.join(String(data.room_id))
    })

    socket.on("create group", (data) => {
      io.to(data.username).emit("Join room", {room_id: data.room_id})
      data.members.forEach(member =>{
        io.to(member.username).emit("Join room", {room_id: data.room_id})
      })
    })

    socket.on("Accept f-request", (data) => {
      io.to(data.requester).emit("Join direct room", {room_id: data.room_id});
      io.to(data.request_to).emit("Join direct room", {room_id: data.room_id});
    })

    ,
    socket.on("Send f-request", (data) => {
      io.to(data.request_to).emit("F-request", (data));
    })

    socket.on("Typing",(data) =>{
      socket.broadcast.to(data.room_id).emit("Someone typing",(data));
    })
    

    socket.on("delete", (data) =>{
      io.to(data.room_id).emit("deleted", data);
      io.to(data.room_id).emit("pin deleted", data);
    })

    socket.on("Leave room",(data) => {
      io.to(data.room_id).emit("A member added",(data));
      socket.leave(data.room_id)
    })

    socket.on("React a message",(data)=>{
      io.to(data.room_id).emit("Reacted",(data));
    })


  })
};
