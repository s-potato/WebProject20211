const Room = require("./models/room");
const User = require("./models/user");
const Message = require("./models/message");

function addMessage(room, user, message, cb) {
  User.findOne({ username: user.username }, function (err, result) {
      console.log(result);
      if (err || !result) {cb({err: "Can't query"})}
      else {
          user = result;
          Room.findById(room.room_id, function (err2, result2) {
              if (err2 || !result2) {cb({err: "Can't query"})}
              else {
                  room = result2;
                  Message.create({ room: room._id, sender: user._id, content: message.body }, function (err3, result3) {
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
          })
      }
  })
}
module.exports = (io) => {
  io.on("connection", (socket) => {
    var username;
    //socket.emit("connection");
    socket.on("userconnected",(data) =>{
      username = data.username;
      console.log(username + " connected."); 
      User.findOne({username: data.username}, (err, result)=>{
        if(!err && result){
          result.status = true;
          result.save(function (err) {
            if (err) console.log(err);
          });
        }
      })
      User.getDirectsList({username: data.username}, (err, result)=>{
        if(!err && result){
          for (friend of result) {
            socket.join(friend.room._id);
          }
        }
      })
      User.getRoomsList({username: data.username}, (err, result)=>{
        if(!err && result){
          for (group of result) {
            socket.join(group._id);
          }
        }
      })
    })


    socket.on('disconnect', () => {
       User.findOne({username: username}, (err, result)=>{
         if(!err && result){
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
      addMessage({ room_id: data.room_id }, { username: data.sender }, { body: data.message }, (err, result)=>{
        if (err){
          console.log(err);
        } else {
          data.date = Date.now();
          console.log(data);
          io.to(data.room_id).emit("response", data);
        }
      });
      
    });
  });
};
