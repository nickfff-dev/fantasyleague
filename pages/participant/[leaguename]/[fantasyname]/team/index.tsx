import { Fixture, Teams, League, Players, Participant, PlayerResult } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import { getPrivateLeagueResults, getPrivateLeagueMatches } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";
import { Grid } from '@components/ui';

import { InferGetServerSidePropsType } from 'next'
import { TeamResults,PlayerResults } from "@components"




function ParticipantTeamPage({ participant, leagueResults, teamResults,theleague }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const results = JSON.parse(leagueResults)
  const team = JSON.parse(teamResults)
  const [totalscore, setTotalScore] = useState(0)
 

  const calculateplayertotalscore = (playerName: string) => {
   const pendingres = []
    const onePlayerRes = results.filter((result: any) => result.Link === playerName )
    pendingres.push({
      name: playerName,


      kills: onePlayerRes.reduce((a: any, b: any) => a + b.Kills, 0),
      deaths: onePlayerRes.reduce((a: any, b: any) => a + b.Deaths, 0),
      assists: onePlayerRes.reduce((a: any, b: any) => a + b.Assists, 0),
      cs: onePlayerRes.reduce((a: any, b: any) => a + b.CS, 0),
      visionScore: onePlayerRes.reduce((a: any, b: any) => a + b.VisionScore, 0),
      teamKills: onePlayerRes.reduce((a: any, b: any) => a + b.TeamKills, 0),
      points: onePlayerRes.map((result: any) => {
        return Number(calculatePlayerScore(result.Kills, result.Deaths, result.Assists, result.CS, result.VisionScore, result.TeamKills))
      }).reduce((a: number, b: number) => a + b, 0)


    })


    console.log (pendingres)
  
     return pendingres
    
    
  }


  
  const calculateTotalScore = () => {
 
    let totalpoints: number[] = []
    results.map((result: any) => {
      
        totalpoints.push(Number(calculatePlayerScore(result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore)))
   




      
    })

    team.map((result: any) => { 
   
      
   
        totalpoints.push(Number(calculateTeamScore(

          result.Team1Dragons, result.Team1Barons, result.Team1RiftHeralds, result.Team1Inhibitors, result.Team1Kills, result.Team1Towers, result.Winner === 1 ? true : false
             
        )))
        totalpoints.push(Number(calculateTeamScore(

          result.Team2Dragons, result.Team2Barons, result.Team2RiftHeralds, result.Team2Inhibitors, result.Team2Kills, result.Team2Towers, result.Winner === 2 ? true : false
             
        )))
   
      
    })
      
  return totalpoints.reduce((a, b) => a + b, 0)
   
  }




  return (
    <div>
      <Grid>
    <div className={s.root} style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
     
          <PlayerResults playerresults={results}
            top={participant.top}
            jungle={participant.jungle}
            mid={participant.mid}
            adc={participant.adc}
            support={participant.support}

          
          
          />
      

       <TeamResults results={team} teamname={participant.team} />
   
      </div>
      <h1>total perfomance
        {totalscore}
      </h1>
      
      </Grid>
     </div>
  )
 }



export const getServerSideProps: GetServerSideProps = async (context) => { 


  const participant = await prisma.participant.findUnique({
    where: {
      fantasyname: context.params?.fantasyname as string,
    }
  }).then(async (participant) => {
    await prisma.$disconnect()
    return participant
   
  })

  
  const theleague = await prisma.league.findUnique({
    where: {
      name: participant?.leaguename as string,
    }
  })

  const leagueResult = await getPrivateLeagueResults(theleague?.startDate as string, theleague?.endDate as string, theleague?.region as string).then(data => {
    return data
  })
  const teamResult = await getPrivateLeagueMatches(theleague?.startDate as string, theleague?.endDate as string, theleague?.region as string)

 
  


  const leagueResults = JSON.stringify(leagueResult)
  const teamResults = JSON.stringify(teamResult)




  return {
    props: { participant, leagueResults, teamResults, theleague},
  }
  
  
}


export default ParticipantTeamPage
