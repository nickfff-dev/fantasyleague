import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'



const LeaguePage = ({ league, teams, players, fixtures }: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
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
          <a href={`/leagues/${league.name}/joinaleague`}>jointhe league va this link</a>
        </div>
       

      <div className={s.root}  style={{color: "white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
       
        {teams? teams.length : 0} teams
      </div>
      

      <div className={s.root}  style={{color: "white",display:"flex", flexDirection:"column", justifyContent:"space-between",}}>
       
        {players? players.length : 0} players
        </div>

 

      </div><br/>
      <div className={s.root} style={{ color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        {fixtures ? fixtures.length : 0} fixtures
        {fixtures?.map((fixture: Fixture) => {
          return (
            <div key={fixture.MatchId}>
              <br/>
              <p>{fixture.DateTime_UTC}</p>
              <p>{fixture.Team1} vs  {fixture.Team2}</p>
              <p>{ fixture.Tab}</p>
              <br/>
            </div>
            
          )
        })} fixtures
      </div>
      
    </Grid>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => { 
  const name = context.params?.name
  const league = await prisma.league.findUnique({
    where: {
      name: name?.toString()
    }
  })
  const teams = await prisma.teams.findMany({
    where: {
      leagueId: league?.id
    }
  })
  const players = await prisma.players.findMany({
    where: {
      leagueId: league?.id
    }
  })
  const fixtures = await prisma.fixture.findMany({
    where: {
      leagueId: league?.id
    }
  })
  return {
    props: {
      league,
      teams,
      players,
      fixtures
    }
  }
}

export default LeaguePage;
