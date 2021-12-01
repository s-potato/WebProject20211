module.exports = (io) => {
    io.on("connection",(socket) => {

        socket.join("rapxiec");

        console.log("A user connected.");
        
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });

        socket.on('chat message',(data) =>{
            console.log('message: ' + data.message + ' from '+ data.sender);
            io.to(data.room).emit('response', {data, date: Date.now});
        });

    })


}