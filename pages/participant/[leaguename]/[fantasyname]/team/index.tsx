import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState} from "react";

import { InferGetServerSidePropsType } from 'next'



function ParticipantTeamPage({ participant, participantTop, participantJungle, participantMid, participantAdc, participantSupport, participantBench1 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
console.log(participantTop)
  return (
    <div style={{ color: "#ffd204" }}>
      <h1>Participant: {participant.name}</h1>
      
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
      
      <p>top:  {participantTop[0].name}</p>
      <p>jungle:  {participantJungle[0].name}</p>
      <p>mid:  {participantMid[0].name}</p>
      <p>adc:  {participantAdc[0].name}</p>
      <p>support:  {participantSupport[0].name}</p>
      <p>bench1:  {participantBench1[0].name}</p>
      </div>
  )
 }



export const getServerSideProps: GetServerSideProps = async (context) => { 
  const fantasyname = context.params?.fantasyname

  const participant = await prisma.participant.findUnique({
    where: {
      fantasyname: context.params?.fantasyname as string,
    }
  }).then(async (participant) => {
    await prisma.$disconnect()
    return participant
   
  })

  const teams = await prisma.teams.findMany({
    where: {
      leagueId: participant?.leagueId
    }
  }).then(async (teams) => {
    await prisma.$disconnect()
    return teams
   
  })

  const players = await prisma.players.findMany({
    where: {
      leagueId: participant?.leagueId
    }
  }).then(async (players) => {
    await prisma.$disconnect()
    return players
   
  })

  const participantTop = players.filter((player: Players) => player.name === participant?.top)
  const participantJungle = players.filter((player: Players) => player.name === participant?.jungle)
  const participantMid = players.filter((player: Players) => player.name === participant?.mid)
  const participantAdc = players.filter((player: Players) => player.name === participant?.adc)
  const participantSupport = players.filter((player: Players) => player.name === participant?.support)
  const participantBench1 = teams.filter((team: Teams) => team.name === participant?.team)


  return {
    props: { participant,  participantTop, participantJungle, participantMid, participantAdc, participantSupport, participantBench1 },
  }
  
  
}


export default ParticipantTeamPage
