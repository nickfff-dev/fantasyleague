import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import io, { Socket } from 'Socket.IO-client'
import useSocket from "useSocket.js";
import socket from "@lib/socket"

import { DefaultEventsMap } from "@socket.io/component-emitter";




const Draft = ({focusonleague, focusonparticipant, participants, teams, players} :{focusonleague:League , focusonparticipant:Participant, participants:Participant[], teams: Teams[], players: Players[]}) => { 


  


 

  const letmein = async () => { 
    const username = focusonparticipant.fantasyname
    socket.auth = { username };
    socket.connect();

}

  
  useEffect(() => { 
    socket.on("user connected", (user: any) => {
    
      console.log("user mpya", user)
         
       })
         socket.on("user", (user: any) => {
        
        console.log("user wote", user)

         })
       socket.onAny((event: any, ...args: any) => {
         console.log(event, args);
       });
       }

  ,[])
  
  




  
  
  return (
    <>
      
      <button onClick={letmein}>letmein</button>
      

 
    <div className={s.root} style={{color: "#ffd204"}}>
      {focusonparticipant.draftOrder ? (<>
        <h1> Draft</h1>

<h1>
  
</h1>
<h1>
 league: {focusonleague.name}<br/>
  teamname:  {focusonparticipant.fantasyname}
  
          {focusonparticipant.mid} <br/>
            draftOrder:   {focusonparticipant.draftOrder} <br/>
            draftDate: {focusonleague.draftTime.split("T")[0]}
          </h1>
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
            participants?.map((participant) => (
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
            teams?.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.name}</td>
                <td>{participant.top}</td>
                <td>{participant.jungle}</td>
                <td>{participant.mid}</td>
                <td>{participant.adc}</td>

                <td>{participant.support}</td>
                <td>{participant.points}</td>
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
           players?.filter((player) => {
            if (player.position === "Top" || player.position === "Jungle" || player.position === "Mid" || player.position === "Bot" || player.position === "Support") {
              return player
            
              
            }
          }).map((participant) => (
              <tr key={participant.id}>
                <td>{participant.name}</td>
                <td>{participant.team}</td>
                <td>{participant.position}</td>
                <td>{participant.points}</td>
             
                </tr>
            ))
        }
      </tbody>
      
      </table>
        
     </div>
        
        </>) : `"not confirmed for draft yet follow this link to confirm draft" http://localhost:3000/leagues/${focusonleague.name}/confirmdraft/${focusonparticipant.fantasyname}`}
     
      </div>

 
      {
    }
    </>
    
  )
}


export const getStaticProps = async ({ params }: { params: any }) => { 
 
  
  const name = params.name
  const fantasyname = params.fantasyname

  const focusonleague = await prisma.league.findUnique({
    where: {name: name},
  })
  const focusonparticipant = await prisma.participant.findFirst({
    where: {leaguename: name, fantasyname: fantasyname},
  })
  const participants = await prisma.participant.findMany({
    where: {
      leaguename: name, leagueId: focusonleague?.id
      
    }
  })

  const teams = await prisma.teams.findMany({
    where: {
      leagueId: focusonleague?.id
    }
  })

  const players = await prisma.players.findMany({
    where: {
      leagueId: focusonleague?.id
    }
  })

  return {
    props: {
      focusonleague , focusonparticipant, participants, teams,players
     
    },
  }
}

export const getStaticPaths = async () => {
  // const leagues = await prisma.league.findMany()

  
  // for (const league of leagues) {
  //   const participants = await prisma.participant.findMany({
  //     where: {leaguename: league.name},
  //   })



  //      paths = participants.map((participant) => ({
  //       params: { name: league.name, fantasyname: participant.fantasyname }
  //     }))
    
  //     return {
  //       paths, fallback: false
  //     }

    
    
  // }

  const leagues = await prisma.league.findMany()
  const participants = await prisma.participant.findMany()
 

  
const paths = participants.map((participant) => ({
  params: { fantasyname: participant.fantasyname, name: participant.leaguename },
}))


  return { paths, fallback: "blocking" }

 
}




export default Draft
function renderMembers(): any {
  throw new Error("Function not implemented.");
}

