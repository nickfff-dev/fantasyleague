import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import io, { Socket } from 'Socket.IO-client'

import { InferGetServerSidePropsType } from 'next'


import { DefaultEventsMap } from "@socket.io/component-emitter";


const socket =  io();

function Draft({ focusonleague, focusonparticipant, participants, teams, players }: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const [usernamealreadyselected, setUsernamealreadyselected] = useState(false)
  const [watu, setWatu] = useState([{ connected: false, self: true, userID: "", username: "", }])
  const[draftPeople, setDraftPeople] = useState([{adc: "", jungle: "", mid: "", support: "", top: "", team: "", username: "", leaguename:"", leagueId: 0, id: 0 }])
  const [message, setMessage] = useState("")
  const [message2, setMessage2] =   useState("")
  const [counter, setCounter] = useState(0)






 

  const letmein = async () => {
    const username = focusonparticipant.fantasyname
    socket.auth = { username };
    socket.connect();

}

  
  
  useEffect(() => { 

  socket.on("people", (data: any) => {
    console.log(data);
    setDraftPeople(data)
  })
    return () => { 
      socket.off("people")
    }
    
}, [draftPeople])
  
  
  
  
  
  
  
  
useEffect(() => { 
  socket.on("counter", (count: any) => {
    setCounter(count);
  })

}, [counter])
useEffect(() => {
  socket.on("draftposition", (data: any) => {
    console.log(data)
  
  })
  return () => { 
    socket.off("draftposition")
  }
}, [])


const prepareDraft = () => {
  socket.emit("preparedraft", focusonleague.name)
 }


  
  
  
  
  
  

  
  

useEffect(() => {

  socket.on("message2", (message2: any) => {
    
    setMessage2(message2)
  })

  return () => {

    socket.off("message2")
  }
}, [])

useEffect(() => {

  socket.on("message", (message: any) => {
   
    setMessage(message)
  })

  return () => {

    socket.off("message")
  }
}, [])
useEffect(() => {
  
  socket.onAny((event: any, ...args: any) => {
    console.log(event, args);
  })

 
  return () => { 
    socket.offAny()
  }
}, [])

useEffect(() => {

  const sessionID = sessionStorage.getItem("sessionID");
  if (sessionID) {

    socket.auth = { sessionID };
    socket.connect();
    
  }

  socket.on("session", ({ sessionID, userID }) => {
 
    socket.auth = { sessionID };
    
 
    sessionStorage.setItem("sessionID", sessionID);

    (socket as any).userID = userID;
     
    

    
  });



  socket.on("connect_error", (err: { message: string; }) => {
    if (err.message === "invalid username") {
      console.log("invalid username")

    }
  });



  return () => {
    socket.off("connect_error")
  }
}

  , [])




useEffect(() => {
  socket.on("connect", () => {
  
    socket.emit("joinRoom", focusonleague.name)
   

    watu.forEach((user: { self: any; connected: boolean; }) => {
      if (user.self) {
        user.connected = true;
       
      
      }
    })
  })

  socket.on("disconnect", () => {
   
    watu.forEach((user: { self: any; connected: boolean; }) => {
      if (user.self) {
        user.connected = false;
      }
    })
  })

  socket.on("users", (users: any[]) => {
    users.forEach((user: any) => {
      for (
        let i = 0; i < watu.length; i++
      ) {

        const existingUser = watu[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = user.connected;
          return
        }
      }

      user.self = user.userID === (socket as any).userID;
      watu.push(user);

      setWatu([...watu])



    })

    watu.sort((a: { self: any; username: string; }, b: { self: any; username: string; }) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    })
   


    
  })

  socket.on("user connected", (user: { userID: any; username: string }) => {
    
    for (let i = 0; i < watu.length; i++) {
      const existingUser = watu[i];

      if (existingUser.userID === user.userID) {
        existingUser.connected = true;
        return;
      }
    }
    watu.push({
      connected: true,
      self: user.userID === (socket as any).userID,
      userID: user.userID,
      username: user.username
    })
    
    setWatu([...watu])

  })
  



  socket.on("user disconnected", (id: any) => {

    for (let i = 0; i < watu.length; i++) {
      const existingUser = watu[i];

      if (existingUser.userID === id) {
        existingUser.connected = false;
        break;
      }
    }

   

  })

  return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");

    socket.off("user disconnected");  
  }
      
    


}, [])

  
  return (
    <>
      
    <div className={s.root} style={{ textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
        <div style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <button style={{color: "#ffd204", float: "left"}}  onClick={letmein}>enter room</button><br/>
    <button style={{color: "#ffd204"}}
      onClick={
        () => { 
          socket.emit("draftposition", focusonleague.name)
        }
      }
      >assigndraftposi</button><br />
      
    <button style={{color: "#ffd204"}}
      onClick={
        () => { 
          socket.emit("startDraft", focusonleague.name)
        }
      }
      >startDraft</button><br />
      
    <button style={{color: "#ffd204"}} onClick={prepareDraft}>preparedraft</button><br/>
 </div>
    {/* <button style={{color: "#ffd204"}} onClick={() => {

      socket.emit("joinDraft", {
          
        fantasyname: focusonparticipant.fantasyname,
        room: focusonleague.name,
      } )
    }}>joindraft</button><br/> */}
      
      <div style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1>users in room</h1>
    {watu?.map((user) => {  
      return (
        
          <span key={user.userID}>{user.username} {focusonleague.room}</span>    
          
          
        
      );
    


    })}
      </div>
      <h1 style={{color: "#ffd204"}}>{counter == 0 ? "wait your turn": "timer: " + counter}</h1>
      
    {/* {
      message ? (<div  style={{color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center"}} ><h1>draft events</h1><p  style={{color: "#ffd204"}}>{ message}</p></div>):(<p style={{color: "#ffd204"}}>draftlog</p>)
    } */}
 
   
 <div  style={{float:"right"}} >
    
    
    {
      message2 ? (<h1 style={{color: "#ffd204"}}>{message2}</h1>):(<h1 style={{color: "#ffd204"}}></h1>)
}</div>
    </div>

  <div className={s.root} style={{color: "#ffd204"}}>
    <div style={{color: "#ffd204", display:"flex", flexDirection:"row" , justifyContent: "space-between"}} >
<div>        <h1> Draft</h1>
<h1>
league: {focusonleague.name}<br/>
teamname:  {focusonparticipant.fantasyname}

       <br/>
          draftOrder:   {`${focusonparticipant.draftOrder}`} 
          draftDate: {focusonleague.draftTime.split("T")[0]}
            </h1> </div>
     
        <table style={{color: "#ffd204"}} hidden={false}>
    <thead>
      <tr>
        <th scope="col">FANTASYNAME</th>
        <th scope="col">Top</th>
        <th scope="col">JNG</th>
          <th scope="col">MID</th>
          <th scope="col">BOT</th>
                <th scope="col">SUP</th>
                
          <th scope="col">TEAM</th>
          
      </tr>
    </thead>
    <tbody>
        {
          draftPeople.map((participant: any) => (
            <tr key={participant.id} >
              <td>{participant.fantasyname}</td>
              <td>{participant.top}</td>
              <td>{participant.jungle}</td>
              <td>{participant.mid}</td>
              <td>{participant.adc}</td>

              <td>{participant.support}</td>
              <td>{participant.team}</td>
              </tr>
          ))
      }
    </tbody>
    
    </table>
    <div style={{ display: "flex", flexDirection: "row" }}>
    <table style={{color: "#ffd204"}} hidden={false}>
    
    <thead>
      <tr>
        <th scope="col">TEAM NAME</th>
        <th scope="col">Top</th>
        <th scope="col">JNG</th>
          <th scope="col">MID</th>
          <th scope="col">BOT</th>
          <th scope="col">SUP</th>
          <th scope="col">POINTS</th>
          
      </tr>
    </thead>
    <tbody>
        {
                teams.slice(5).map((team: Teams) => (
                  <tr key={team.id} onClick={
                    () => { 
                      socket.emit("draftPick", {
                        name: team.name,
                        fantasyname: focusonparticipant.fantasyname,
                        role: "Team", 
                        draftName: focusonleague.name,
                      })
                      
                    }
            }>
              <td>{team.name}</td>
              <td>{team.top}</td>
              <td>{team.jungle}</td>
              <td>{team.mid}</td>
              <td>{team.adc}</td>
              <td>{team.support}</td>
              <td>{team.points}</td>
              </tr>
          ))
      }
    </tbody>
    
    </table>
    <table style={{color: "#ffd204"}} hidden={false}>
    
    <thead>
      <tr>
        <th scope="col">playername</th>
        <th scope="col">player team</th>
        <th scope="col">role</th>
          <th scope="col">points</th>
     
          
      </tr>
    </thead>
    <tbody>
        {
         players.slice(5).filter((player: Players) => {
          if (player.position === "Top" || player.position === "Jungle" || player.position === "Mid" || player.position === "Bot" || player.position === "Support") {
            return player
          
            
          }
        }).map((player: Players) => (
          <tr key={player.id} onClick={
            () => {
              console.log(player.position)
              socket.emit(
                "draftPick", 
                {
                  name: player.name,
                  fantasyname: focusonparticipant.fantasyname,
                  role: player.position,
                  draftName : focusonleague.name,
    
                }
              
            )}
          }>
              <td>{player.name}</td>
              <td>{player.team}</td>
              <td>{player.position}</td>
              <td>{player.points}</td>
           
              </tr>
          ))
      }
    </tbody>
    
    </table>
      
   </div>
      
      </div>
   
    </div>


    {
  }
  </>
  )
}



export const getServerSideProps: GetServerSideProps = async (context) => { 
  const leaguename = context.params?.leaguename as string
  const fantasyname = context.params?.fantasyname as string
  const focusonleague = await prisma.league.findUnique({
    where: {
      name: leaguename, 
    }
  }).then(async (league) => {
    await prisma.$disconnect()
    return league
   
  })

  const focusonparticipant = await prisma.participant.findFirst({
    where: {leaguename: leaguename, fantasyname: fantasyname},
  }).then(async (participant) => {
    await prisma.$disconnect()
    return participant
   
  })
  const participants = await prisma.participant.findMany({
    where: {
      leaguename: leaguename, leagueId: focusonleague?.id
      
    }
  }).then(async (participants) => {
    await prisma.$disconnect()
    return participants
   
  })

  const teams = await prisma.teams.findMany({
    where: {
      leagueId: focusonleague?.id
    }
  }).then(async (teams) => {
    await prisma.$disconnect()
    return teams
   
  })

  const players = await prisma.players.findMany({
    where: {
      leagueId: focusonleague?.id
    }
  }).then(async (players) => {
    await prisma.$disconnect()
    return players
   
  })

  return {
    props: { focusonleague, focusonparticipant, participants, teams, players },
  }
}


export default Draft
