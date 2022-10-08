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






function ParticipantTeamPage({ participant }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }



  return (
    <div>
      <Grid>
    <div className={s.root} style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
     
          <PlayerResults
          
            top={participant.top}
            jungle={participant.jungle}
            mid={participant.mid}
            adc={participant.adc}
            support={participant.support}
            
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
    
       
      return data
    })
  

 

  return {
    props: {
      participant: participantd,
    }
    }
    




  


 
  


  
  
}


export default ParticipantTeamPage
