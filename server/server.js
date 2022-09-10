const app = require('express')()
const server = require('http').Server(app)
const cors = require('cors')
const io = require('socket.IO')(server
  , {
    cors: {
      origin: "http://localhost:3000",
    }
  }
)
const prisma = require('prisma').prisma 
const port = parseInt(process.env.PORT, 10) || 5000
const hostname = 'localhost'






io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});


io.on("connection", (socket) => {

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

 
});





server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://${hostname}:${port}`)
})
