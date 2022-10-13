// Components
import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, TeamResult} from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { calculatePlayerScore,  calculateTeamScore } from "@lib/calculate";
import { useSession, signIn, signOut } from 'next-auth/react';
import x from '@components/ui/Button/Button.module.css';
import { useRouter } from 'next/router';



const PlayerResults = ({  participant,   smdata }: { smdata: any, participant: any }) => { 
 
 


  function getPlayerScore( playerresults: any, role: string) { 
    


    const playerpoints = playerresults.filter((player: any) => {
      if (
       
        (player.role === role)
     
      
      ) { 
        return player;

      }
    }).reduce(
      (acc: number, result: any) => acc + result.points, 0
    )
      
    return playerpoints;
    
    
  }
  



  const teamPPoints = (smarr: any) => {
    const teampoints = smarr?.filter((result: any) => result.name === participant.team ).reduce((acc: number, result: any) => {

    return    acc + result.points
  
  
    }, 0)
   
    
    return teampoints
  }






  
  return (<>
    <Grid>
      
      <div className={s.root}>
      <button  className={x.outline} style={{color: "black"}}>updateresults</button>
        <h1> Player Results </h1>
  
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if ( result.role === "Top") {
                return (
                  <div className={s.item} key={index}>
               <p>Role: {result.role}<br /> name: {result.name}</p>
                  <p> game: {result.team1} vs {result.team2 }</p>
                  <p>tab: {result.game.split("_").slice(1).join("_")}</p>
                    
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    
                  <p>assists: {result.assists}</p>
                  <p>teamkills: {result.teamTotalKills}</p>
                  <p>CS: {result.creepScore}</p>
                  <p>VisionScore: {result.visionScore}</p>
                  <p>points: {result.points}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            getPlayerScore( smdata.playerres,  "Top")
        }
     
       
             
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.role === "Jungle") {
                return (
                  <div className={s.item} key={index}>
              <p>Role: {result.role}<br /> name: {result.name}</p>
                    <p>game: {result.team1} vs {result.team2 }</p>
                  <p>tab: {result.game.split("_").slice(1).join("_")}</p>
                 
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                  
                  <p>assists: {result.assists}</p>
                  <p>teamkills: {result.teamTotalKills}</p>
                  <p>CS: {result.creepScore}</p>
                  <p>VisionScore: {result.visionScore}</p>
                  <p>points: {result.points}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
          getPlayerScore( smdata.playerres,  "Jungle")
        }
 
     
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.role === "Mid") {
                return (
                  <div className={s.item} key={index}>
                    <p>Role: {result.role}<br /> name: {result.name}</p>
                    <p>game: {result.team1} vs {result.team2 }</p>
                  <p>tab: {result.game.split("_").slice(1).join("_")}</p>
             
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                   
                  <p>assists: {result.assists}</p>
                  <p>teamkills: {result.teamTotalKills}</p>
                  <p>CS: {result.creepScore}</p>
                  <p>VisionScore: {result.visionScore}</p>
                    <p>points: {result.points}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
           getPlayerScore( smdata.playerres,  "Mid")
        }
 
     

        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.role === "Bot" ) {
                return (
                  <div className={s.item} key={index}>
                    <p>{result.role}<br /> {participant.adc}</p>
                    <p>game: {result.team1} vs {result.team2 }</p>
                  <p>tab: {result.game.split("_").slice(1).join("_")}</p>
        
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                  
                  <p>assists: {result.assists}</p>
                  <p>teamkills: {result.teamTotalKills}</p>
                  <p>CS: {result.creepScore}</p>
                  <p>VisionScore: {result.visionScore}</p>
                  <p>points: {result.points}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
             getPlayerScore( smdata.playerres,  "Bot")
        }
    
       
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1500px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.role === "Support") {
                return (
                  <div className={s.item} key={index}>
                    <p>{result.role}<br /> {result.name}</p>
                    <p> game: {result.team1} vs {result.team2}</p>
                    <p>date { result.date}</p>
                  <p>tab: {result.game.split("_").slice(1).join("_")}</p>
   
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                 
                  <p>assists: {result.assists}</p>
                  <p>teamkills: {result.teamTotalKills}</p>
                  <p>CS: {result.creepScore}</p>
                  <p>VisionScore: {result.visionScore}</p>
                  <p>points: {result.points}</p>
                </div>
               )
              }
          
})}
          </div>

        
        </Grid>
     <h1>total points</h1>
        {
           getPlayerScore( smdata.playerres,  "Support")
        }
     
        
        
      </div>
    </Grid>
    <Grid>
      <div className={s.root}>
        <h1> Team Results </h1>
 
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1500px"}}>
            {smdata.teamres?.map((result: any) => {
             
              if (result.name === participant.team) {   
                return (
                  <div className={s.item} key={smdata.teamres.indexOf(result)}>
                  <p>team: {result.name }</p>
                
                  <p> game:  {result.team1} vs {result.team2 }</p>
                        <p>tab: {result.game.split("_").slice(1).join("_")}</p>
                        <p>dragonkills: {result.dragonKills}</p>
                        <p>baronkills: {result.baronKills}</p>
                        <p>heraldkills: {result.riftHeraldKills}</p>
                        <p>inhibkills: {result.inhibitorKills}</p>
                        <p>teamkills: {result.teamKills}</p>
                  <p>turretkills: {result.turretKills}</p>
                 
                  <p>date: {
                   result.date
                  }</p>
                        <p>didWin: {
                          `${result.didWin}`
                        }</p>
                        <p>points: {result.points}</p>
                    
                  </div>
              )
          }
            
          }           
          )}
          </div>
          </Grid>


        <h1>totalpoints </h1>
          {
            teamPPoints(smdata.teamres)
        }
        
        <h1>number of games</h1>{
          smdata.teamres?.filter((result: any) => result.name === participant.team ).reduce((acc: number, result: any) => {
            return acc + 1
          }, 0)
        }
        </div>
    
    </Grid>

    <Grid>
      <h1>total player points</h1>
   
    </Grid>
  </>)

}


export default PlayerResults;
