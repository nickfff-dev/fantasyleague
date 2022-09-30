const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.IO')(server)
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const hostname = 'localhost'
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, hostname, port })
const nextHandler = nextApp.getRequestHandler()
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { PrismaDraftStore } = require("./draftStore");
const draftStore = new PrismaDraftStore()
const { instrument } = require("@socket.io/admin-ui");



instrument(io, {
  auth: false,
});


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

  
    const people = io.sockets.adapter.rooms.get(room); 
    if (people) {
      const roomppl = []
      for (const person of people) {
        let personsocket = io.sockets.sockets.get(person);
        if (personsocket.username === socket.username) {
          socket.emit("message", personsocket.username + " is already in the room");
         
  
        }
        else {
          socket.join(room);
          socket.room = room;
          socket.emit("message", socket.username + " joined the room " + room);

  
    
      
        
        }
     


      }

      
       

    }
    else { 
      socket.join(room);
      socket.room = room;
      socket.emit("message", socket.username + " You joined the room " + room);

  
    
  
      
    }

  
    
  });
  
  socket.on("preparedraft", async (room) => {
   
    const addTodraft = io.sockets.adapter.rooms.get(room);
  
    const draft = {
      name: room,
    }
    try {
     draftStore.saveDraft(draft).then(() => {
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
    }  


  
  
  })

  
  socket.on("draftposition", async (room) => { 
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
    
  
  }catch (e) {
  console.log(e);
    }
  })

  socket.on("populate", async (room) => {
    const draftMembers = draftStore.getDraftMembers(room);
    draftMembers.then((draftMembers) => {
      io.to(room).emit("people", draftMembers);
    })

  })


  socket.on("draftPick", async (data) => {
    try {
      const FantasyName = data.fantasyname;
      const updatePosition = data.role;
      const updateValue = data.name;
      const draftName = data.draftName
      const leagueId = data.leagueId
      const choiceId = data.choiceId

      draftStore.updateDraftPick(FantasyName, updatePosition, updateValue, leagueId, choiceId).then(() => {
        
        draftStore.getDraftMembers(draftName).then((data) => {
          io.to (draftName).emit("people", data)
        })
        
      })
      
      
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
      for (let h = 0; h < round.length; h++) {
        try {
          (function (h) {
               
      const turntimeOut =  setTimeout(function () {
        var counter = 10
        const draftMember = draftMembersWithSocketId.filter((draftMember) => draftMember.draftOrder === round[h])[0];
        const socket = io.sockets.sockets.get(draftMember.socketId);
   
        socket.emit("message2",  draftMember.fantasyname + " turn to pick a " + roundName);
        socket.emit("counter", counter);
        const interval = setInterval(() => {
          counter--;
          socket.emit("counter", counter);
          if (counter === 0) { 
            clearInterval(interval);
            clearTimeout(turntimeOut)

          }
     
      
        }, 1000);

        socket.on("draftPick", async (data) => { 
          clearInterval(interval);
          clearTimeout(turntimeOut)
       

          
        })

    


      }, 10000 * h);
          } )(h);
        } catch (e) {
          console.log(e);
        }
      }
    };
    try {
      topSess(topRound, "top");
      setTimeout(function () {
        topSess(jungleRound, "jungle");
      }, 10000 * topRound.length);
      setTimeout(function () {
        topSess(midRound, "mid");
      }, 10000 * (topRound.length + jungleRound.length));
      setTimeout(function () {
        topSess(adcRound, "adc");
      }, 10000 * (topRound.length + jungleRound.length + midRound.length));
      setTimeout(function () {
        topSess(supportRound, "support");
      }, 10000 * (topRound.length + jungleRound.length + midRound.length + adcRound.length));
      setTimeout(function () {
        topSess(teamRound, "team");
      }, 10000 * (topRound.length + jungleRound.length + midRound.length + adcRound.length + supportRound.length));
    } catch (e) {
      console.log(e);
    } 

    
  });

  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });

  });
 console.log(users)
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

nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return nextHandler(req, res)
  })
  //  add nextauth to express
  
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}

  
  


)


