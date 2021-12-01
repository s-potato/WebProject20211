const Room = require("./models/room");
const User = require("./models/user");
const Message = require("./models/message");

function addMessage(room, user, message, cb) {
  User.findOne({ username: user.username }, function (err, result) {
      console.log(result);
      if (err || !result) {cb({err: "Can't query"})}
      else {
          user = result;
          Room.findOne({ name: room.name }, function (err2, result2) {
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
    socket.join("rapxiec");

    console.log("A user connected.");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("chat message", (data) => {
      console.log("message: " + data.message + " from " + data.sender);
      addMessage({ name: data.room }, { username: data.sender }, { body: data.message }, (err, result)=>{
        if (err){
          console.log(err);
        } else {
          data.date = Date.now();
          console.log(data);
          io.to(data.room).emit("response", data);
        }
      });
      
  });
});
};
