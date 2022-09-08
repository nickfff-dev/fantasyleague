
import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";


const ConfirmLeagueTrade = () => { 
  return (
    <div>
      <h1>League Trade confirm</h1>
    </div>
  )
}







export const getStaticProps = async ({ params }: { params: any }) => { 


  const league = await prisma.league.findUnique({
    where: {name: params.name},
  })

  if (!league){return} 
    const fixtures = await prisma.fixture.findMany({
      where: {leagueId: league.id},
    })
    const teams = await prisma.teams.findMany({
      where: {leagueId: league.id},
    })
    const players = await prisma.players.findMany({
      where: {leagueId: league.id},
    })
 

  return {
    props: {
      league, teams, players, fixtures
    },
  }
}

export const getStaticPaths = async () => { 
  const leagues = await prisma.league.findMany()
  const paths = leagues.map((league) => ({
    params: { name: league.name },
  }))

  return { paths, fallback: false }
}


export default ConfirmLeagueTrade
