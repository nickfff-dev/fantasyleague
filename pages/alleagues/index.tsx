import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'


const AllOpenLeagues = ({ leagues }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
 
  return (
    <Grid>
          <div className={s.root} style={{color: "#ffd204"}}>
      <h1>Open Leagues</h1>
      {
        leagues.map((league:League) => (
          <div key={league.id} className={s.container}>
            <p>name: {league?.name}</p>
            <p>region: {league?.region}</p>
            <p>owner: {league?.owner}</p>
            <p>duration {league?.duration} days</p>
            <a href={`/joinaleague/${league.name}`}>join league link</a>

          </div>
        ))
      }

    </div>
</Grid>
  )
 }












export const getServerSideProps: GetServerSideProps = async () => { 
  const leagues = await prisma.league.findMany({
  }).then(async (leagues) => {
    await prisma.$disconnect()
    return leagues
   
  })
  return {
    props: { leagues }
  }
}















export default AllOpenLeagues

