import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useSession, signIn, signOut, getSession } from 'next-auth/react';



const LeaguePage = ({ league, teams, players, fixtures, participants}: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
    
  const [leagueResults, setLeagueResults] = useState([] as any) 
  const [isOldLeague, setIsOldLeague] = useState(false)
  const getresults = async () => {
    await fetch("/api/leagueresults/" + league.name, {
      method: "GET",
    }).then((res) => res.json().then((data) => {
      
      if (data === "not played yet") {
        setIsOldLeague(false)
        console.log(data)
      }
      else { 
        setLeagueResults(JSON.parse(data))
        setIsOldLeague(true)
        console.log(data)

      }
      
      
    }))
  }


  useEffect(() => { 
    if (leagueResults.length === 0 ) {
      getresults()
      setIsOldLeague(false)
      
    } else { 
      console.log("league results already loaded")
      setIsOldLeague(false)
    }



  }, [ leagueResults])



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
          <a href={`/joinaleague/${league.name}`}>join the league via this link</a>
        </div>
       

      <div className={s.root}  style={{color: "white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
       
        {teams._count.id} teams
      </div>
      

      <div className={s.root}  style={{color: "white",display:"flex", flexDirection:"column", justifyContent:"space-between",}}>
       
        {players._count.id} players
        </div>

 

      </div><br/>
      <Grid>
      <div className={s.root} style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
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
        })}
      </div>
      </Grid><br/>
      
      <Grid>
      <div className={s.root} style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
       
        
      </div>
      </Grid>
      <p style={{ color: "white" }}>league points {league.points > 0 ? league.points : "not played yet"}</p>
      
      <Grid>
    
          <div className={s.root} style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "space-between",  }}>
          {
        leagueResults?.playerdataz?.map((player: any) => {
            return (
              <div key={player.participantId} style={{width: "200px", paddingRight: "10px"}}>
                <p ><a href={`/participant/${league.name}/${participants?.find((participant: Participant) => participant.id === player.participantId)?.fantasyname}/Overview`}>{participants?.find((participant: Participant) => participant.id === player.participantId)?.fantasyname}</a></p> <br/>
                <p> kills : {player._sum.kills}</p>
                <p> deaths : {player._sum.deaths}</p>
                <p> assists : {player._sum.assists}</p>
                <p>creepcore: {
                  player._sum.creepScore
                }</p>
                <p>visionScore: {
                  player._sum.visionScore
                }</p>
                <p> teamTotalKills : {player._sum.teamTotalKills}</p>
  
                
  
                <p>baronKills : {
                 leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.baronKills
                
                }</p>
  
                <p>dragonKills : {
                
                  leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.dragonKills
                }</p>
  
                <p>inhibitorKills : {
                
                  leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.inhibitorKills
                } </p>
  
  
                <p>towerKills : {
                   
                  leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.turretKills
                
                }</p>
  
  
                <p> riftHeraldKills : {
                      leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.riftHeraldKills
                }</p>
  
                <p>
                  teamKills: {
                    leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.teamKills
  }
  
                </p>
  
                <p>points: {
                  player._sum.points + leagueResults?.teamdata?.find((team: any) => team.participantId === player.participantId)?._sum.points
                }</p><br/>
              </div>
  
               
            )
          })
        }
       </div>
      
     </Grid>
      
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
  const participants = await prisma.participant.findMany({
    where: {
      leagueId: league?.id
    }
  }).then(async (data) => { 
    await prisma.$disconnect()
    return data
  })
  const teams = await prisma.teams.aggregate({
    _count: {
      id: true
    },
    where: {
      leagueId: league?.id
    }
  }).then(async (teams) => {
    await prisma.$disconnect()
    return teams
   
  })
  const players = await prisma.players.aggregate({
    _count: {
      id: true
    },
    where: {
      leagueId: league?.id
    }
  }).then(async (players) => {

    await prisma.$disconnect()
    return players
   
  })
  const fixtures = await prisma.fixture.findMany({
    where: {
      leagueId: league?.id
    }
  }).then(async (fixtures) => {
    await prisma.$disconnect()
    return fixtures
   
  })
  return {
    props: {
      participants,
      league,
      teams,
      players,
      fixtures,
    

    }
  }
}

export default LeaguePage;
