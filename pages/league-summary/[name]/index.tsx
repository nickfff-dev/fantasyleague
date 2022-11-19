import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useSession, signIn, signOut, getSession } from 'next-auth/react';



const LeaguePage = ({ league}: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
    







  return (
    <Grid>
      <div  style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}} >
      <div className={s.root} style={{color: "#ffd204"}}>
        <h1>name: {league.name}</h1>
        <p>region: {league.region}</p>
        <p>owner: {league.owner}</p>
        <p>isinviteonly: {league.inviteOnly}</p>
        <p>invitecode: {league.inviteCode}</p>
        <p>drafttime: {league.draftTime}</p>
        <p>startdate: {league.startDate}</p>
        <p>enddate: {league.endDate}</p>
          <p>isBuyin: {`${league.buyIn}`}</p>
          <p>duration: { league.duration} days</p>
          <p>id: {league.id}</p>
          <a href={`/optin-league/${league.name}`}>join the league via this link</a>
        </div>
       


 

      </div><br/>

      
    </Grid>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => { 
  
  const name = context.params?.name

  const league = await prisma.league.findUnique({
    where: {
      name: name?.toString()
    }
  }).then(async (data) => {
 
    await prisma.$disconnect()
    return data
   
  })
  
  return {
    props: {

      league,

    

    }
  }
}

export default LeaguePage;
