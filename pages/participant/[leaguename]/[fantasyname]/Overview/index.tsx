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




function ParticipantTeamPage({ participant, leagueResults, teamResults }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const results =JSON.parse(leagueResults)
  const team = JSON.parse(teamResults)

 

 

 console.log(team)
  


      
  



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

  


  const leagueResult =  await prisma.playerResult.findMany({

    where: {
      leagueId: participant?.leagueId,

    }
  }).then(data => {

    return data
  })
  const teamResult = await prisma.teamResult.findMany({
    where: {
      leagueId: participant?.leagueId,
    

    }
  }).then((data) => {
     
    return data
  })

 
  

  const teamResults = JSON.stringify(teamResult)
  const leagueResults = JSON.stringify(leagueResult)



  return {
    props: { participant, leagueResults, teamResults},  
  }
  
  
}


export default ParticipantTeamPage
