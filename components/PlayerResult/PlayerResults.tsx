// Components
import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, TeamResult} from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { calculatePlayerScore } from "@lib/calculate";
import { useSession, signIn, signOut } from 'next-auth/react';
import x from '@components/ui/Button/Button.module.css';
import { useRouter } from 'next/router';



const PlayerResults = ({ playerresults, top, jungle, mid, adc, support }: { playerresults: any, top: String, mid: String,jungle: String,adc: String,support: String, }) => { 

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }
  return (<>
    <Grid>
      <div className={s.root}>
        <h1> Player Results </h1>
  
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.Link === top && result.Role === "Top") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.Role}<br /> {result.Link}</p>
                  <p>fixture: {result.GameId}</p>
                  
                  <p>kills: {result.Kills}</p>
                  <p>deaths: {result.Deaths}</p>
                  <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.Link === top && result.Role === "Top").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.Kills , result.Assists , result.Deaths , result.TeamKills , result.CS, result.VisionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.Link === top && result.Role === "Top").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
             
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.Link === jungle && result.Role === "Jungle") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.Role}<br /> {result.Link}</p>
                  <p>fixture: {result.GameId}</p>
                  
                  <p>kills: {result.Kills}</p>
                  <p>deaths: {result.Deaths}</p>
                  <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.Link === jungle && result.Role === "Jungle").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.Kills , result.Assists , result.Deaths , result.TeamKills , result.CS, result.VisionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.Link === jungle && result.Role === "Jungle").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.Link === mid && result.Role === "Mid") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.Role}<br /> {result.Link}</p>
                  <p>fixture: {result.GameId}</p>
                  
                  <p>kills: {result.Kills}</p>
                  <p>deaths: {result.Deaths}</p>
                  <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.Link === mid && result.Role === "Mid").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.Kills , result.Assists , result.Deaths , result.TeamKills , result.CS, result.VisionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.Link === mid && result.Role === "Mid").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }

        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.Link === adc && result.Role === "Bot") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.Role}<br /> {result.Link}</p>
                  <p>fixture: {result.GameId}</p>
                  
                  <p>kills: {result.Kills}</p>
                  <p>deaths: {result.Deaths}</p>
                  <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.Link === adc && result.Role === "Bot").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.Kills , result.Assists , result.Deaths , result.TeamKills , result.CS, result.VisionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.Link === adc && result.Role === "Bot").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.Link === support && result.Role === "Support") {
                return (
                  <div className={s.item} key={index}>
                  <p>{result.Role}<br /> {result.Link}</p>
                  <p>fixture: {result.GameId}</p>
                  
                  <p>kills: {result.Kills}</p>
                  <p>deaths: {result.Deaths}</p>
                  <p>assists: {result.Assists}</p>
                  <p>teamkills: {result.TeamKills}</p>
                  <p>CS: {result.CS}</p>
                  <p>VisionScore: {result.VisionScore}</p>
                  <p>points: {calculatePlayerScore(
                    result.Kills, result.Assists, result.Deaths, result.TeamKills, result.CS, result.VisionScore
                    )}</p>
                
                </div>
               )
              }
})}
          </div>

        
        </Grid>
     <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.Link === support && result.Role === "Support").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.Kills , result.Assists , result.Deaths , result.TeamKills , result.CS, result.VisionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.Link === support && result.Role === "Support").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
      </div>
    </Grid>
  </>)

}


export default PlayerResults;
