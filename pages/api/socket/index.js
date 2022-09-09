import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  const io = new Server(res.socket.server)
  const users = [];
    io.use((socket, next) => {
      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }
      socket.username = username;
      next();
    });

    io.on("connection", (socket) => {
      // notify existing users
      socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
      });
    });

    io.on("connection", (socket) => {

  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  // ...
});
  
  
 
   res.end()


  }


export default SocketHandler
