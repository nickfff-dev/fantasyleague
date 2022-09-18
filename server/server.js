const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
// const {DraftManager} = require('./draftStore')
const app = require("express")();
const server = require("http").Server(app);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { PrismaDraftStore } = require("./draftStore");
const draftStore = new PrismaDraftStore();

const initializeTeamPickArray = require("./runDraft");
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.IO")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

const port = 5000;
const hostname = "localhost";

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

  // join the "league" room
  socket.on("joinRoom", async (room) => {
    if (socket.room == room) {
      socket.emit(
        "message",
        "Already in a room" + socket.username + " " + socket.room
      );
      return;
    }
    socket.join(room);

    socket.room = room;

    const roommembers = io.sockets.adapter.rooms.get(room);
    const wmembers = [];
    for (const member of roommembers) {
      const memberSocket = io.sockets.sockets.get(member);
      wmembers.push({
        username: memberSocket.username,
        room: memberSocket.room,
        userID: memberSocket.userID,
        sessionID: memberSocket.sessionID,
      });

      if (memberSocket.username === socket.username) {
        continue;
      }
      // console.log(draftStore.getDraft(room))
      socket.emit(
        "message",
        memberSocket.username + " is in the room" + " " + socket.room
      );
    }

    io.to(room).emit("roommembers", wmembers);
  });
  socket.on("createDraft", async (room) => {
    try {
      const draft = {
        name: room,
      };

      draftStore.saveDraft(draft);
      io.to(room).emit("draftcreated", draft);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("joinDraft", async (data) => {
    try {
      const member = {
        fantasyname: data.fantasyname,
      };
      const draftName = data.room;
      draftStore.addDraftMember(draftName, member);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("assigndraftpositions", async (room) => {
    try {
      const draftMemmbers = draftStore.getDraftMembers(room);
      draftMemmbers.then((draftMemmbers) => {
        const draftMemmbersLength = draftMemmbers.length;

        const draftposition = [];
        for (let i = 0; i < draftMemmbersLength; i++) {
          draftposition.push(i);
        }

        const shuffled = draftposition.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, draftMemmbersLength);

        for (let i = 0; i < draftMemmbersLength; i++) {
          draftStore.updateDraftMemberDraftOrder(
            room,
            draftMemmbers[i].fantasyname,
            selected[i]
          );
        }

        io.to(room).emit("message", "draftMemmbers2");
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("preparedraft", async (room) => {
   
    const addTodraft = io.sockets.adapter.rooms.get(room);
  
    const draft = {
      name: room,
    }
    try {
      await draftStore.saveDraft(draft).then(() => {
  for (const newMember of addTodraft) { 
    const memberSocket = io.sockets.sockets.get(newMember);
    const member = {
      fantasyname: memberSocket.username,
    };
    const draftName = room;
    draftStore.addDraftMember(draftName, member);
  }
 })}catch (e) {
  console.log(e);
    } finally {

      const draftMemmbers = draftStore.getDraftMembers(room);
      draftMemmbers.then((draftMemmbers) => {
        const draftMemmbersLength = draftMemmbers.length;

        const draftposition = [];
        for (let i = 0; i < draftMemmbersLength; i++) {
          draftposition.push(i);
        }

        const shuffled = draftposition.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, draftMemmbersLength);

        for (let i = 0; i < draftMemmbersLength; i++) {
          draftStore.updateDraftMemberDraftOrder(
            room,
            draftMemmbers[i].fantasyname,
            selected[i]
          );
        }

        io.to(room).emit("message", "draftMemmbers2");
      });
    
  
}


  
  })





  socket.on("draftPick", async (data) => {
    try {
      const FantasyName = data.fantasyname;
      const updatePosition = data.role;
      const updateValue = data.name;

      draftStore.updateDraftPick(FantasyName, updatePosition, updateValue);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("startDraft", async (room) => {
    const draftMembers = await draftStore.getDraftMembers(room);
    const roommembers = io.sockets.adapter.rooms.get(room);
    // add socket
    const draftMembersWithSocketId = draftMembers.map((draftMember) => {
      const memberSocket = Array.from(roommembers).find((member) => {
        const memberSocket = io.sockets.sockets.get(member);
        return memberSocket.username === draftMember.fantasyname;
      });
      return {
        ...draftMember,
        socketId: memberSocket,
      };
    });
    var numberofteams = draftMembersWithSocketId.length;
    var numberofrounds = 6;
    var numberofpicks = numberofteams * numberofrounds;
    var numberofpicksperround = 1;

    let teamPickArray = [];

    for (var i = 0; i < numberofrounds; i++) {
      if (i % 2 == 0) {
        for (var j = 0; j < numberofteams; j++) {
          teamPickArray.push(j);
        }
      } else {
        for (var x = numberofteams - 1; x >= 0; x--) {
          teamPickArray.push(x);
        }
      }
    }

    var rounds = 6;
    let roundArray = [];
    var roundArrayIndex = 0;
    for (var y = 0; y < rounds; y++) {
      roundArray.push(
        teamPickArray.slice(roundArrayIndex, roundArrayIndex + numberofteams)
      );
      roundArrayIndex += numberofteams;
    }
    const topRound = roundArray[0];
    const jungleRound = roundArray[1];
    const midRound = roundArray[2];
    const adcRound = roundArray[3];
    const supportRound = roundArray[4];
    const teamRound = roundArray[5];

    const allRounds = [
      topRound,
      jungleRound,
      midRound,
      adcRound,
      supportRound,
      teamRound,
    ];
 console.log( allRounds)
    const topSess = (round, roundName) => {
      for (let h = 0; h < round.length;) {
        try {
          (function (h) {
            setTimeout(function () {
              var counter = 8
              const draftMember = draftMembersWithSocketId.filter((draftMember) => draftMember.draftOrder === round[h])[0];
              const socket = io.sockets.sockets.get(draftMember.socketId);
              
              socket.emit("message2",  draftMember.fantasyname + " turn to pick a " + roundName);
              socket.emit("counter", counter);
              const interval = setInterval(() => {
                counter--;
                socket.emit("counter", counter);
                if (counter === 0) { 
                  clearInterval(interval);
    
                }
               }, 1000);
            }, 8000 * h);
          } )(h);
        } catch (e) {
          console.log(e);
        }finally {
          h++
        }
      }
    };
    try {
      topSess(topRound, "top");
      setTimeout(function () {
        topSess(jungleRound, "jungle");
      }, 8000 * topRound.length);
      setTimeout(function () {
        topSess(midRound, "mid");
      }, 8000 * (topRound.length + jungleRound.length));
      setTimeout(function () {
        topSess(adcRound, "adc");
      }, 8000 * (topRound.length + jungleRound.length + midRound.length));
      setTimeout(function () {
        topSess(supportRound, "support");
      }, 8000 * (topRound.length + jungleRound.length + midRound.length + adcRound.length));
      setTimeout(function () {
        topSess(teamRound, "team");
      }, 8000 * (topRound.length + jungleRound.length + midRound.length + adcRound.length + supportRound.length));
    } catch (e) {
      console.log(e);
    } 

    // run the other rounds after the first one
  });

  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });
  });
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
  if (err) throw err;
  console.log(`> Ready on http://${hostname}:${port}`);
});
