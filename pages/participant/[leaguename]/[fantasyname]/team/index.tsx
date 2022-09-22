import { Fixture, Teams, League, Players, Participant, PlayerResult } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import { getPrivateLeagueResults, getPrivateLeagueMatches } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";

import { InferGetServerSidePropsType } from 'next'



function ParticipantTeamPage({ participant, leagueResults, teamResults }: InferGetServerSidePropsType<typeof getServerSideProps>) {

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

  useEffect(() => { 
    setTotalScore(calculateTotalScore())
 
  })


  return (
    <div style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
      {
        results.map((result: any, index: number) => { 
        
            return (
              <>
                 <br/>
              <div key ={result.GameId}>
                <p>{result.Role}<br/> {result.Link}</p>
                
                <p>kills: {result.Kills}</p>
                <p>deaths: {result.Deaths}</p>
                <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                  )}</p>
                  <br/>
              </div>
              <br/>
    </>
            )
            
          

        })
      }
      

        {
          team.map((result: any, index: number) => { 
            
              return (
                <>
                  <br />
                  <div key={index}>
                    <p>team: {result.Team1 ? result.Team1 : result.Team2}</p>
                    
                    <p>points: {result.GameId}</p>
                    <p>dragonkills: {result.Team1Dragons}</p>
                    <p>baronkills: {result.Team1Barons}</p>
                    <p>heraldkills: {result.Team1RiftHeralds}</p>
                    <p>inhibkills: {result.Team1Inhibitors}</p>
                    <p>towerkills: {result.Team1Kills}</p>
                    <p>turretkills: {result.Team1Towers}</p>
                    <p>didWin: {
                      result.Winner === 1 ? `${true}` : `${false}`
                    }</p>
                    <p>points: {calculateTeamScore(

                      result.Team1Dragons, result.Team1Barons, result.Team1RiftHeralds, result.Team1Inhibitors, result.Team1Kills, result.Team1Towers, result.Winner === 1 ? true : false
                    )}</p>
                  </div>
                  </>
              )
              
            
          })
        }
        {
          team.map((result: any, index: number) => { 
            
              return (
                <>
                  <br />
                  <div key={index}>
                    <p>team: {result.Team2 ? result.Team2 : result.Team2}</p>
                    
                    <p>points: {result.GameId}</p>
                    <p>dragonkills: {result.Team2Dragons}</p>
                    <p>baronkills: {result.Team2Barons}</p>
                    <p>heraldkills: {result.Team2RiftHeralds}</p>
                    <p>inhibkills: {result.Team2Inhibitors}</p>
                    <p>towerkills: {result.Team2Kills}</p>
                    <p>turretkills: {result.Team2Towers}</p>
                    <p>didWin: {
                      result.Winner === 2 ? `${true}` : `${false}`
                    }</p>
                    <p>points: {calculateTeamScore(

                      result.Team2Dragons, result.Team2Barons, result.Team2RiftHeralds, result.Team2Inhibitors, result.Team2Kills, result.Team2Towers, result.Winner === 2 ? true : false
                    )}</p>
                  </div>
                  </>
              )
              
            
          })
        }
   
      </div>
      <h1>total perfomance
        {totalscore}
      </h1>
      
     
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

  const leagueResult = await getPrivateLeagueResults(theleague?.startDate as string, theleague?.endDate as string, theleague?.region as string)
  const teamResult = await getPrivateLeagueMatches(theleague?.startDate as string, theleague?.endDate as string, theleague?.region as string)

  const playerperf = leagueResult?.filter((result: any) => { 
    if (result.Link === participant?.top || result.Link === participant?.jungle || result.Link === participant?.mid || result.Link === participant?.adc || result.Link === participant?.support) {
      return result
    }
  
   })
  
  const teamperf = teamResult?.filter((result: any) => { 
    if (result.Team1 === participant?.team || result.Team2 === participant?.team) {
      return result
    }
  })


  const leagueResults = JSON.stringify(playerperf)
  const teamResults = JSON.stringify(teamperf)




  return {
    props: { participant, leagueResults, teamResults},
  }
  
  
}


export default ParticipantTeamPage
