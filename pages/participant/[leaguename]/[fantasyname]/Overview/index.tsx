import { Fixture, Teams, League, Players, Participant, PlayerResult } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import { getPrivateLeagueResults, getPrivateLeagueMatches } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";
import { Grid } from '@components/ui';
import { useRouter } from 'next/router';

import { InferGetServerSidePropsType } from 'next'
import { PlayerResults } from "@components"






function ParticipantTeamPage({ participant, leagueResults, teamResults }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }
  const results =JSON.parse(leagueResults)
  const team = JSON.parse(teamResults)


 
  
  


      
  



  return (
    <div>
      <Grid>
    <div className={s.root} style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
     
          <PlayerResults
          playerresults={results}
            top={participant.top}
            jungle={participant.jungle}
            mid={participant.mid}
            adc={participant.adc}
            support={participant.support}
            results={team}
            teamname={participant.team}
            leaguename={participant.leaguename}
            fantasyname={participant.fantasyname}
            

          
          
          />
      

       
   
      </div>
 
      </Grid>
     </div>
  )
 }



export const getServerSideProps: GetServerSideProps = async (context) => { 

  

  const participantd = await prisma.participant.findUnique({
    where: {
      fantasyname: context.params?.fantasyname as string,
    }
  }).then(async (data) => {
    fetch("http://localhost:3000/api/populateleague/" + data?.leaguename, {
      method: "POST",
      body: JSON.stringify({
        fantasyname: data?.fantasyname,
      }),
    }).then((res) => { 
      res.text().then((info) => {
        console.log(info);
      
       })
    })

    const leagueResult =  await prisma.playerResult.findMany({

      where: {
        participantId: data?.id,
        
  
      }
    }).then(data => {
  
      return data
    })
    const teamResult = await prisma.teamResult.findMany({
      where: {
        participantId: data?.id,
       
      
  
      }
    }).then((data) => {
       
      return data
    })
  
   
     
  
    const teamResults = JSON.stringify(teamResult)
    const leagueResults = JSON.stringify(leagueResult)
 
  
    await prisma.$disconnect()
    return {
       data, leagueResults, teamResults}
    
    
    
   
  })




  


 
  

  if(!participantd) {
    return {
      notFound: true,
    }
  }
  const teamResults = participantd.teamResults
  const leagueResults = participantd.leagueResults

  const participant = participantd.data



  return {
    props: { participant, leagueResults, teamResults}, 
  }
  
  
}


export default ParticipantTeamPage
