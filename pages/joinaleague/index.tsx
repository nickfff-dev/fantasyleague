import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";




const AllOpenLeagues = ({ leagues }: { leagues: League[] }) => {
  
 
  return (
    <Grid>
          <div className={s.root} style={{color: "#ffd204"}}>
      <h1>Open Leagues</h1>
      {
        leagues.map((league) => (
          <div key={league.id} className={s.container}>
            <p>name: {league?.name}</p>
            <p>region: {league?.region}</p>
            <p>owner: {league?.owner}</p>
            <p>duration {league?.duration} days</p>
            <a href={`/leagues/${league.name}/joinaleague`}>join league link</a>

          </div>
        ))
      }

    </div>
</Grid>
  )
 }












export const getStaticProps = async () => { 
  const leagues = await prisma.league.findMany({})

  if (!leagues) { return}




  return {
    props: {
      leagues
    },
  }
}















export default AllOpenLeagues

