// Components
import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, TeamResult} from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { calculateTeamScore } from "@lib/calculate";
import { useSession, signIn, signOut } from 'next-auth/react';
import x from '@components/ui/Button/Button.module.css';
import { useRouter } from 'next/router';


const TeamResults = ({ results, teamname }: { results: any, teamname: String }) => { 
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }
  return (<>
    <Grid>
      <div className={s.root}>
        <h1> Team Results </h1>
 
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row"}}>
            {results.map((result: any) => {
              if (result.Team1 === teamname) {
                return (
                  <div className={s.item} key={results.indexOf(result)}>
                  <p>team: {result.Team1 }</p>
                  <p>playing against: { result.Team2}</p>
                        
                        <p>fixture: {result.GameId}</p>
                        <p>dragonkills: {result.Team1Dragons}</p>
                        <p>baronkills: {result.Team1Barons}</p>
                        <p>heraldkills: {result.Team1RiftHeralds}</p>
                        <p>inhibkills: {result.Team1Inhibitors}</p>
                        <p>towerkills: {result.Team1Kills}</p>
                  <p>turretkills: {result.Team1Towers}</p>
                  <p>gamename{ result.Gamename}</p>
                  <p>date: {
                   result.DateTime_UTC
                  }</p>
                        <p>didWin: {
                          result.Winner === 1 ? `${true}` : `${false}`
                        }</p>
                        <p>points: {calculateTeamScore(
    
                          result.Team1Dragons, result.Team1Barons, result.Team1RiftHeralds, result.Team1Inhibitors, result.Team1Kills, result.Team1Towers, result.Winner === 1 ? true : false
                        )}</p>
                    
                  </div>
              )
            }
          }           
          )}
          </div>
          </Grid>

<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row"}}>
          {
              results.map((result: any) => {
              
                if (result.Team2 === teamname) {
                  return (
                    <div  key={results.indexOf(result)}>
                    <p>team: {result.Team2}</p>
                    <p>playing against: { result.Team1}</p>
                 <p>fixture: {result.GameId}</p>
                 <p>dragonkills: {result.Team2Dragons}</p>
                 <p>baronkills: {result.Team2Barons}</p>
                 <p>heraldkills: {result.Team2RiftHeralds}</p>
                 <p>inhibkills: {result.Team2Inhibitors}</p>
                 <p>towerkills: {result.Team2Kills}</p>
             <p>turretkills: {result.Team2Towers}</p>
             <p>gamename{ result.Gamename}</p>
             <p>date: {
            result.DateTime_UTC
           }</p>
                 <p>didWin: {
                   result.Winner === 2 ? `${true}` : `${false}`
                 }</p>
                 <p>points: {calculateTeamScore(

                   result.Team2Dragons, result.Team2Barons, result.Team2RiftHeralds, result.Team2Inhibitors, result.Team2Kills, result.Team2Towers, result.Winner === 2 ? true : false
                 )}</p>


             </div>
                  )
                }
            }
        
            
            )
            }
      
          </div>
    
        </Grid>
        <h1>totalpoints </h1>
          {
            results.filter((result: any) => result.Team1 === teamname || result.Team2 === teamname).reduce((acc: number, result: any) => {
              if (result.Team1 === teamname) {
                return acc + calculateTeamScore(
                  result.Team1Dragons, result.Team1Barons, result.Team1RiftHeralds, result.Team1Inhibitors, result.Team1Kills, result.Team1Towers, result.Winner === 1 ? true : false
                )
              } else {
                return acc + calculateTeamScore(
                  result.Team2Dragons, result.Team2Barons, result.Team2RiftHeralds, result.Team2Inhibitors, result.Team2Kills, result.Team2Towers, result.Winner === 2 ? true : false
                )
              }
            
               }, 0)
        }
        
        <h1>number of games</h1>{
          results.filter((result: any) => result.Team1 === teamname || result.Team2 === teamname).reduce((acc: number, result: any) => { 
            return acc + 1
          }, 0)
        }
        </div>
    
    </Grid>
  
  
  
  
  </>)


}


export default TeamResults;
