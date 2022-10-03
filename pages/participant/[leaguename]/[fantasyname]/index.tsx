import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState} from "react";

import { InferGetServerSidePropsType } from 'next'




function ParticipantPage({ participant, top, jungle }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  
  const populatets = async () => { 
    await fetch("/api/populateleague/thebestleague", {
      method: "POST",
      body: JSON.stringify({
        fantasyname: participant.fantasyname,
      }),
    }).then((res) => {
      res.text().then((text) => { 
        console.log(text);
      })
    })
  }
  return (
    <div  style={{color: "#ffd204"}}>
      <h1>Participant: {participant.name}</h1>
      <p>id: {participant.id}</p>
      <p>name: {participant.fantasyname}</p>
      <p>leaguename: {participant.leaguename}</p>
      <p>top:  {participant.top}</p>
      <p>jungle:  {jungle}</p>
      <p>mid:  {participant.mid}</p>
      <p>adc:  {participant.adc}</p>
      <p>support:  {participant.support}</p>
      <p>bench1:  {participant.team}</p>

      <button
      onClick={populatets}
      >populte</button>

    

    </div>)
}


export const getServerSideProps: GetServerSideProps = async (context) => { 
  const leaguename = context.params?.leaguename


  const participant = await prisma.participant.findUnique({
    where: {
      fantasyname: context.params?.fantasyname as string,
  
      
    }
  }).then(async (participant) => {
    await prisma.$disconnect()
    return participant
   
  })

  const top = participant?.top
  const jungle = participant?.jungle
  const mid = participant?.mid
  const adc = participant?.adc
  const support = participant?.support
  return {
    props: { participant, top, jungle },
  }
}



export default ParticipantPage
