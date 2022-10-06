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



const PlayerResults = ({ playerresults, top, jungle, mid, adc, support, leaguename, results, teamname, fantasyname }: { playerresults: any, top: String,leaguename:String, mid: String,jungle: String,adc: String,support: String,results: any, teamname: String, fantasyname:String  }) => { 
 
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }


  const updateResults = async () => {
  
    refreshData()
    
  }

  const teamPPoints = (smarr: any) => {
    const teampoints = smarr.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {

    return    acc + result.points
  
  
    }, 0)
   
    
    return teampoints
  }

  const calculateplayerpoints = (smarr: any) => {
    const toPPoints = smarr.filter((result: any) => result.name === top && result.role === "Top").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const jgPPoints = smarr.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const midPPoints = smarr.filter((result: any) => result.name === mid && result.role === "Mid").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const adcPPoints = smarr.filter((result: any) => result.name === adc && result.role === "Bot").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const supPPoints =smarr.filter((result: any) => result.name === support && result.role === "Support").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const playerPointstotal = toPPoints + jgPPoints + midPPoints + adcPPoints + supPPoints
    
    return {toPPoints , jgPPoints , midPPoints , adcPPoints ,supPPoints , playerPointstotal }


  }
   





  
  return (<>
    <Grid>
      
      <div className={s.root}>
      <button onClick={updateResults} className={x.outline} style={{color: "black"}}>updateresults</button>
        <h1> Player Results </h1>
  
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults?.map((result: any, index: number) => {
              if (result.name === top &&  result.role === "Top") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.role}<br /> {result.name}</p>
                  <p>fixture: {result.game}</p>
                  
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    <p>gamename: { result.game}</p>
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
            calculateplayerpoints(playerresults).toPPoints
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === top && result.role === "Top").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
             
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults?.map((result: any, index: number) => {
              if (result.name === jungle && result.role === "Jungle") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.role}<br /> {result.name}</p>
                  <p>fixture: {result.game}</p>
                  
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    <p>gamename: { result.game}</p>
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
            calculateplayerpoints(playerresults).jgPPoints
        }
        <h1>number of games</h1>
        {
          playerresults?.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults?.map((result: any, index: number) => {
              if (result.name === mid) {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.role}<br /> {result.name}</p>
                  <p>fixture: {result.game}</p>
                  
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    <p>gamename: { result.game}</p>
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
            calculateplayerpoints(playerresults).midPPoints
        }
        <h1>number of games</h1>
        {
          calculateplayerpoints(playerresults).midPPoints
        }

        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.name === adc ) {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.role}<br /> {adc}</p>
                  <p>fixture: {result.game}</p>
                  
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    <p>gamename: { result.game}</p>
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
             calculateplayerpoints(playerresults).adcPPoints
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === adc && result.role === "Bot").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.name === support ) {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.role}<br /> {result.name}</p>
                  <p>fixture: {result.game}</p>
                  
                  <p>kills: {result.kills}</p>
                    <p>deaths: {result.deaths}</p>
                    <p>gamename: { result.game}</p>
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
            calculateplayerpoints(playerresults).supPPoints
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === support && result.role === "Support").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
      </div>
    </Grid>
    <Grid>
      <div className={s.root}>
        <h1> Team Results </h1>
 
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row"}}>
            {results.map((result: any) => {
             
              if (result.name === teamname) {   
                return (
                  <div className={s.item} key={results.indexOf(result)}>
                  <p>team: {result.name }</p>
                
                        
                        <p>fixture: {result.game}</p>
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
            teamPPoints(results)
        }
        
        <h1>number of games</h1>{
          results.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {
            return acc + 1
          }, 0)
        }
        </div>
    
    </Grid>

    <Grid>
      <h1>total player points</h1>
      {
        calculateplayerpoints(
          playerresults
        ).playerPointstotal  + teamPPoints( results)
      }
    </Grid>
  </>)

}


export default PlayerResults;
