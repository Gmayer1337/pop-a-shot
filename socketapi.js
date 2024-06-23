const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("end", () => {
      console.log("user left");
  })
});

function broadcast(message) {
  if (message) {
    console.log('Broadcasting ' + message);
    io.emit('score', { points: message }); 
  }
}

setInterval(() => {
  broadcast(2);
}, 3000); 

module.exports = socketapi;
