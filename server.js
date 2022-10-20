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

io.on("connection",  (socket) => {
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    isReady: socket.isReady,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  const roomStore = new RoomStore(io, socket);
  socket.on("joinRoom", async (room) => {
    
    const people = io.sockets.adapter.rooms.get(room);
    if (people) {
      const roomppl = [];
      for (const person of people) {
        let personsocket = io.sockets.sockets.get(person);
        if (personsocket.username === socket.username) {
          socket.emit(
            "message",
            personsocket.username + " is already in the room"
          );
        } else {
          socket.join(room);
          socket.room = room;
          socket.emit("message", socket.username + " joined the room " + room);
          try {
            const draftMembers = await draftStore.getDraftMembers(room);
            const userbalance = draftMembers.filter((member) => member.fantasyname === socket.username);
            draftStore.getDraftMemberWallet(userbalance[0].userId).then((wallet) => { 
              socket.emit("balance", wallet);
            })
          }catch (err) { console.log(err) }
          
         
        }
      }
    } else {
      socket.join(room);
      socket.room = room;
      socket.emit("message", socket.username + " You joined the room " + room);
      try {
        const draftMembers = await draftStore.getDraftMembers(room);
        const userbalance = draftMembers.filter((member) => member.fantasyname === socket.username);
        draftStore.getDraftMemberWallet(userbalance[0].userId).then((wallet) => { 
          socket.emit("balance", wallet);
        })
      }catch (err) { console.log(err) }
   

    }

    await roomStore.onPlayerReady();
  


  });

  socket.on("playerpicked", async() => {
   await roomStore._shiftTurn();
  })
  socket.on("draftPick", async (data) => {

    const userId = data.userId;
    console.log(userId);
    await draftStore.getDraftMemberWallet(userId).then(async (balance) => {
      console.log(balance);
      if (balance > 500) {
        try {
          const FantasyName = data.fantasyname;
          const updatePosition = data.role;
          const updateValue = data.name;
          const draftName = data.draftName;
          const leagueId = data.leagueId;
          const choiceId = data.choiceId;
    
          draftStore
            .updateDraftPick(
              FantasyName,
              updatePosition,
              updateValue,
              leagueId,
              choiceId,
              userId
            )
            .then(() => {
              draftStore.getDraftMembers(draftName).then((data) => {
                io.to(draftName).emit("people", data);
              });
         
            }).then( () => {
              draftStore.getDraftMemberWallet(userId).then((balance) => { 
                socket.emit("balance", balance)
              })
            })
        } catch (e) {
          console.log(e);
        }
      }
      else {
        socket.emit("message", `You don't have enough money to make this pick balance is ${balance}` );
      }


    })


  });

  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      isReady: session.isReady,
    });
  });
  console.log(users);
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    isReady: socket.isReady,
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
        isReady: socket.isReady,
      });
    }
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
