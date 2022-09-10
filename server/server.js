
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");

const app = require('express')()
const server = require('http').Server(app)

const cors = require('cors')
const { instrument } = require("@socket.io/admin-ui");
const io = require('socket.IO')(server
  , {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      credentials: true,
    
    }
  }
)
instrument(io, {
  auth: false
});

const prisma = require('prisma').prisma
const port =  5000
const hostname = 'localhost'








const sessionStore = new InMemorySessionStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();


});


io.on("connection", (socket) => {
  
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  socket.emit("league")

  // join the "league" room
  socket.on("ingia", (room) => {

   
   
        if (socket.rooms.has(room)) {
          socket.emit("message",`already joined ${room}`);
          return
        } else { 
          socket.join(room)
          socket.to(room).emit("message", `${socket.username} has joined the room ${room} draft`)
        }
      
    
  })

  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });
  })
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });


  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });




   
});





server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://${hostname}:${port}`)
})




