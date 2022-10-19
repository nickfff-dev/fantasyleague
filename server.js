const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.IO")(server);
const next = require("next");
const {RoomStore} = require("./roomStore");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = "localhost";
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { PrismaDraftStore } = require("./draftStore");
const draftStore = new PrismaDraftStore();
const { instrument } = require("@socket.io/admin-ui");


instrument(io, {
  auth: false,
  
});

const sessionStore = new InMemorySessionStore();
io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      socket.isReady = session.isReady;
      
      return next();
    }
  }
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }
  const userID = await draftStore.getDraftMember(socket.room, username)
  socket.sessionID = userID.id.toString() + "_" + username
  socket.userID =  userID.id
  socket.username = username;
  socket.isReady = userID.isReady;


  next();
});

io.on("connection", (socket) => {

  const roomStore = new RoomStore(io, socket);
  roomStore.saveSession();
  roomStore.emitSession();
  socket.on("joinRoom",
    async (room) => { 
      await roomStore.joinRoom(room)
    }
  )
  socket.on("preparedraft", async (room) => {
    await roomStore.assignDraftOrder(room);
  });

 

  socket.on("populate", async (room) => {
    const draftMembers = draftStore.getDraftMembers(room);
    draftMembers.then((draftMembers) => {
      io.to(room).emit("people", draftMembers);
    });
  });



  socket.on("draftPick", async (data) => {
    await roomStore.ondraftPick(data).then(async() => {
     await roomStore.shiftTurn();
    })
     
  });

  socket.on("imready", async (data) => {
    await roomStore.onPlayerReady(data)

  })


  roomStore.emitUsers()

  roomStore.emitUserConnected()

  socket.on("disconnect", async () => { 
    await roomStore.onDisconnect()
   });
});

nextApp.prepare().then(() => {
  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });
  //  add nextauth to express

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
