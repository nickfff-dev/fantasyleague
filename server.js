const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.IO')(server)
const next = require('next')
const prisma = require('prisma').prisma 
const port = parseInt(process.env.PORT, 10) || 3000
const hostname = 'localhost'
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, hostname, port })
const nextHandler = nextApp.getRequestHandler()


io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});


io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  // ...
});

io.on("connection", (socket) => {
  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}

  
  


)


