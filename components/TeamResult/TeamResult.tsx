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
              if (result.name === teamname) {
                return (
                  <div className={s.item} key={results.indexOf(result)}>
                  <p>team: {result.name }</p>
                
                        
                        <p>fixture: {result.game}</p>
                        <p>dragonkills: {result.dragonKills}</p>
                        <p>baronkills: {result.baronKills}</p>
                        <p>heraldkills: {result.riftHeraldKills}</p>
                        <p>inhibkills: {result.inhibitorKills}</p>
                        <p>towerkills: {result.teamKills}</p>
                  <p>turretkills: {result.turretKills}</p>
                 
                  <p>date: {
                   result.Date
                  }</p>
                        <p>didWin: {
                          `${result.didWin}`
                        }</p>
                        <p>points: {calculateTeamScore(
    
                          result.dragonKills, result.baronKills, result.riftHeraldKills, result.inhibitorKills, result.teamKills, result.turretKills, result.didWin
                        )}</p>
                    
                  </div>
              )
            }
          }           
          )}
          </div>
          </Grid>


        <h1>totalpoints </h1>
          {
            results.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {

                return acc + calculateTeamScore(
                  result.dragonKills, result.baronKills, result.riftHeraldKills, result.inhibitorKills, result.teamKills, result.turretKills, result.didWin
                )
            
            
               }, 0)
        }
        
        <h1>number of games</h1>{
          results.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {
            return acc + 1
          }, 0)
        }
        </div>
    
    </Grid>
  
  
  
  
  </>)


}


export default TeamResults;
