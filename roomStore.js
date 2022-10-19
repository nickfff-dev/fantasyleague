const { InMemorySessionStore } = require("./sessionStore");
const { PrismaDraftStore } = require("./draftStore");
const { addEmitHelpers } = require("typescript");
const draftStore = new PrismaDraftStore();
const sessionStore = new InMemorySessionStore();



class RoomStore {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.teamPickArray = [];
    this.draftMembersWithSocketId = [];
  
    this.counter =  30 * 1000;
    this.draftTimeOut = null
    this.maxTimer =  30 * 1000;
    this.draftOrder = 0


    
    
  }



  async saveSession() {
    sessionStore.saveSession(this.socket.sessionID, {
      userID: this.socket.userID,
      username: this.socket.username,
      connected: true,
      isReady:  this.socket.isReady ? this.socket.isReady : false
    })

    
  }


  
  async emitSession() {
    this.socket.emit("session", {
      sessionID: this.socket.sessionID,
      userID: this.socket.userID,
      isReady:   this.socket.isReady,
    })
  }
  async joinRoom(room) {
    const people = this.io.sockets.adapter.rooms.get(room);
    if (people) {
   
      for (const person of people) {
        let personsocket = this.io.sockets.sockets.get(person);
        if (personsocket.username === this.socket.username) {
          this.socket.emit(
            "message",
            personsocket.username + " is already in the room"
          );
        } else {
          this.socket.join(room);
          this.socket.room = room;
          this.socket.emit("message", this.socket.username + " joined the room " + room);
          this.emitBalance(room);
          
         
        }
      }
    } else {
      this.socket.join(room);
      this.socket.room = room;
      this.socket.emit("message", this.socket.username + " You joined the room " + room);
      this.emitBalance(room);
   

    }

  }


  async emitUsers() {
    const users = [];
    sessionStore.findAllSessions().forEach(async (session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        isReady: session.isReady,
      });
    });
    console.log(users);
    this.socket.emit("users", users);

  }
  
  async onDisconnect() { 

      const matchingSockets = await this.io.in(this.socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
  
      if (isDisconnected) {
        // notify other users
        this.socket.broadcast.emit("user disconnected", this.socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(
          this.socket.sessionID,
          {
            userID: this.socket.userID,
            username: this.socket.username,
            connected: false,
          }
        );
        
      }
    
  }

  async emitBalance(room) {
    try {
      const draftMembers = await draftStore.getDraftMembers(room);
      const userbalance = draftMembers.filter((member) => member.fantasyname === this.socket.username);
      draftStore.getDraftMemberWallet(userbalance[0].userId).then((wallet) => { 
        this.socket.emit("balance", wallet);
      })
    }catch (err) { console.log(err) }
  }

  async emitUserConnected() { 
      
    this.socket.broadcast.emit("user connected", {
      userID: this.socket.userID,
      username: this.socket.username,
      connected: true,
      isReady:   this.socket.isReady ? this.socket.isReady : false,
    })
  }


  async emitDraftMembers(room) { 
    const draftMembers = await draftStore.getDraftMembers(room);
    this.io.to(room).emit("people", draftMembers);
  }

  async assignDraftOrder(room) {
    const addTodraft = this.io.sockets.adapter.rooms.get(room);

    const draft = {
      name: room,
    };

    await draftStore
      .saveDraft(draft)
      .then(async () => {
        for (const newMember of addTodraft) {
          const memberSocket = this.io.sockets.sockets.get(newMember);
          const member = {
            fantasyname: memberSocket.username,
          };
          const draftName = room;
          await draftStore.addDraftMember(draftName, member);
        }
      })
      .then(async () => {
        await draftStore.getDraftMembers(room).then(async (draftMemmbers) => {
          const draftMemmbersLength = draftMemmbers.length;

          const draftposition = [];
          for (let i = 0; i < draftMemmbersLength; i++) {
            draftposition.push(i);
          }

          const shuffled = draftposition.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, draftMemmbersLength);

          for (let i = 0; i < draftMemmbersLength; i++) {
            await draftStore.updateDraftMemberDraftOrder(
              room,
              draftMemmbers[i].fantasyname,
              selected[i]
            );
          }

          this.io.to(room).emit("people", draftMemmbers);
        });
      }).then(async () => { 
        
        await this.generateSnakeDraftOrder(room);

        

      })
  }


  async generateDraftMemberWithSocketID(room) { 
    const roommembers = this.io.sockets.adapter.rooms.get(room);
    const draftMembers = await draftStore.getDraftMembers(room);
   
this.draftMembersWithSocketId = draftMembers.map((draftMember) => {
  const memberSocket = Array.from(roommembers).find((member) => {
    const memberSocket = this.io.sockets.sockets.get(member);
    return memberSocket.username === draftMember.fantasyname;
  });
  return {
    ...draftMember,
    socketId: memberSocket,
  };
})
    
    
  }

  async getDraftMemberWithSocketID(room) { 
    if (this.draftMembersWithSocketId.length > 0) { 
      return this.draftMembersWithSocketId
     
    } else {
      await this.generateDraftMemberWithSocketID(room);
      return this.draftMembersWithSocketId
    }
    
  }

  async generateSnakeDraftOrder(room) {

      if (this.draftMembersWithSocketId.length === 0) {
        await this.getDraftMemberWithSocketID(room);
    } 
    var numberofteams = this.draftMembersWithSocketId.length
    var numberofrounds = 6;




for (var i = 0; i < numberofrounds; i++) {
  if (i % 2 == 0) {
    for (var j = 0; j < numberofteams; j++) {
      this.teamPickArray.push(j);
    }
  } else {
    for (var x = numberofteams - 1; x >= 0; x--) {
      this.teamPickArray.push(x);
    }
  }
    }
    
    this.io.to(room).emit("message", `draft order looks like this ${JSON.stringify(this.teamPickArray)}`);


  

  }
    
  async ondraftPick(data) {
    
    const userId = data.userId;
    await draftStore.getDraftMemberWallet(userId).then(async (balance) => {
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
                    this.emitDraftMembers(draftName);
         
            }).then( () => {
              this.emitBalance(draftName);

            })
          
          
        } catch (e) {
          console.log(e);
        }
      }
      else {
        this.socket.emit("message", `You don't have enough money to make this pick balance is ${balance}`);

      }


    })
   

  }

  async getSnakeDraftOrder(room) {
    if (this.teamPickArray.length > 0) {
      return this.teamPickArray;
    }
    else { 

      await this.generateSnakeDraftOrder(room);
      return this.teamPickArray;
      
   
    
    }
  }


  async onPlayerReady(data) {
    this.socket.isReady = true;

    sessionStore.updateSession(this.socket.sessionID)
    await draftStore.updateMemberReady(data.draftName, data.fantasyname)
    
  
    this.emitDraftMembers(data.draftName)
    this.emitUsers()

    await draftStore.getDraftMembers(data.draftName).then(async (members) => { 
      if (members.every((member) => member.isReady)) {
        await this.assignDraftOrder(data.draftName)
        await this.beginDraft()
        
      }
    })
    
  }

 async beginDraft() { 
    await this._emitTurn(this.draftOrder)
  }

async _emitTurn(draftOrder) {

      
  
    
  const currentPick =  this.draftMembersWithSocketId.find((draftperson) => draftperson.draftOrder === this.teamPickArray[draftOrder])
   
      const draftroom = currentPick.draftName;
      const socker = this.io.sockets.sockets.get(currentPick.socketId)
     socker.emit("message", `It's ${currentPick.fantasyname}'s turn to pick`)
    socker.to(draftroom).emit("message", `It's ${currentPick.fantasyname}'s turn to pick`)
   await this._triggerTimeOut();
    
      
  }

  async _nextTurn() {
   console.log(this.draftOrder)
   const draftPeople = this.draftMembersWithSocketId.find((member) => member.draftOrder === this.teamPickArray[this.draftOrder])
    console.log("after", draftPeople)
    const socker = this.io.sockets.sockets.get(draftPeople.socketId)
    socker.emit("message", ` ${draftPeople.fantasyname}'s turn to pick is over`)
    socker.to(this.socket.room).emit("message", `turn is over for ${draftPeople.fantasyname}`)

    const totalpicks = this.teamPickArray.length
    if (this.draftOrder < totalpicks) {
      const nextPick = this.draftOrder + 1;
      this.draftOrder = nextPick;
     await this._emitTurn(nextPick)
       
    }
    
  }

  async _triggerTimeOut() { 
    this.draftTimeOut  = setTimeout(async () => { 
     await this._nextTurn()
    }, this.maxTimer)
  }

  async _resetTimeOut() { 
    if (typeof this.draftTimeOut === 'object') {
      clearTimeout(this.draftTimeOut)
    }
  }



  async shiftTurn() { 
    await this._resetTimeOut();

    this.socket.emit("message", ` ${this.socket.username}'s turn to pick is over`)
    this.socket.to(this.socket.room).emit("message", `turn is over for ${this.socket.username}`)

    const totalpicks = this.teamPickArray.length
    if (this.draftOrder < totalpicks) {
      const nextPick = this.draftOrder + 1;
      this.draftOrder = nextPick;
       await this._emitTurn(nextPick)
       
    }
  }




  


}


module.exports = { RoomStore };
