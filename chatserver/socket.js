const Room = require("./models/room");
const User = require("./models/user");
const Message = require("./models/message");

function addMessage(room, user, message, type, cb) {
  User.findOne({ username: user.username }, function (err, result) {
    console.log(result);
    if (err || !result) { cb({ err: "Can't query" }) }
    else {
      user = result;
      Room.findById(room.room_id, function (err2, result2) {
        if (err2 || !result2) { cb({ err: "Can't query" }) }
        else {
          room = result2;
          if (type === "text") {
            Message.create({ room: room._id, sender: user._id, content: message.body}, function (err3, result3) {
              if (err3) { cb(err3) }
              else {
                console.log(result3);
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
                console.log(result3);
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
            console.log(friend.room._id);
            socket.join(String(friend.room._id));
          }
        }
      })
      User.getRoomsList({ username: data.username }, (err, result) => {
        if (!err && result) {
          for (group of result) {
            console.log(group.id);
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
        }
      })
      console.log(username + " disconnected");
    });

    socket.on("chat message", (data) => {
      console.log("message: " + data.message + " from " + data.sender);
      addMessage({ room_id: data.room_id }, { username: data.sender }, { body: data.message }, "text", (err, result) => {
        if (err) {
          console.log(err);
        } else {
          data.date = Date.now();
          console.log("send data" + data);
          io.to(data.room_id).emit("response", data);
          /*update room.update at
          
          */
        }
      });
    });

    socket.on("image message", (data) => {
      console.log("image: " + " from " + data.sender);
      addMessage({ room_id: data.room_id }, { username: data.sender }, { body: data.file }, "image", (err, result) => {
        if (err) {
          console.log(err);
        } else {
          data.date = Date.now();
          data.type = "image";
          console.log("send data" + data);
          io.to(data.room_id).emit("image response", data);
        }
      });
    });


  });
};
