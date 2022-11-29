import { Fixture, Teams, League, Players, Participant, PlayerResult } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import { getPrivateLeagueResults, getPrivateLeagueMatches } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";
import { Grid } from '@components/ui';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next'
import { PlayerResults } from "@components"
import ResultDetail from "@components/PlayerResult/ResultDetail";




function ParticipantTeamPage({ participant, results, league}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }
  const [rosterChange,  setRosterChange] = useState([]);
  const getRosterChanges = async () => {
    await fetch(`http://localhost:3000/api/rosterchanges/${participant.fantasyname}/`, {

      method: 'POST',
      body: JSON.stringify({
        leagueId: participant?.leagueId,
        top: participant?.top,
        mid: participant?.mid,
        bot: participant?.adc,
        sup: participant?.support,
        jungle:participant?.jungle,
        startDate: league?.startDate,
        endDate: league?.endDate
 
        
      }),
    }).then((res) => {
       res.json().then((data) => {
         console.log(JSON.parse(data).acceptedChanges) 
          setRosterChange(JSON.parse(data).acceptedChanges)
       })
    })
  }
  useEffect(() => { 
    getRosterChanges()
  }, [rosterChange])
  return (
    <>
      {/* <ResultDetail results={results} participant={participant} league={ league} /> */}
    <div className="m-5 overflow-hidden  ">
      <div className="p-20">
    <div className={s.root} style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
          <div>
            <h1>rosterchanges</h1>
          {rosterChange &&  rosterChange.length > 0 &&  rosterChange.map((change: any) => (
            <div key={change.id} className="flex flex-row gap-5">

              <p>player: {change.Player}</p>
              <p>role: {change.Role}</p>
              <p>move: {change.Direction}</p>
              <p>team: {change.Team}</p>
              <p>date: {change.Date_Sort}</p>
            </div>
        ))}
        </div>
          <PlayerResults
           smdata={results}
            participant={participant}
           
            

          
          
          />
      

       
   
        </div>

        
 
      </div>
     </div></>
  )
 }



export const getServerSideProps: GetServerSideProps = async (context) => { 
  const fantasyname = context?.params?.fantasyname as string;
  const leaguename = context?.params?.leaguename as string;
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  const league = await prisma.league.findUnique({
    where: {
      name: leaguename
    },
    include: {
      members: true,
      fixtures: true,
      
    }
  })
  const participantd = league?.members.find((participant) => participant.fantasyname === fantasyname)

  
  const mavitu = await fetch(`http://localhost:3000/api/populate-fantasy/${leaguename}/`, {
    method: 'POST',
    body: JSON.stringify({
      fantasyname: fantasyname,
    }),
  }).then((res) =>
    res.json().then((data) => { 
      return JSON.parse(data)
    }))


  return {
    props: {
      participant: participantd,
      results: mavitu,
      league: league,
     
      
    }
    }
    




  


 
  


  
  
}


export default ParticipantTeamPage
