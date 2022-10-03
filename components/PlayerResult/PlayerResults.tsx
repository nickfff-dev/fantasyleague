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
              if (result.name === top && result.role === "Top") {
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
                  <p>points: {calculatePlayerScore(
                    result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.name === top && result.role === "Top").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === top && result.role === "Top").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
             
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
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
                  <p>points: {calculatePlayerScore(
                    result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.name === mid && result.role === "Mid") {
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
                  <p>points: {calculatePlayerScore(
                    result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.name === mid && result.role === "Mid").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === mid && result.role === "Mid").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }

        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row",}}>
            {playerresults.map((result: any, index: number) => {
              if (result.name === adc && result.role === "Bot") {
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
                  <p>points: {calculatePlayerScore(
                    result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>
        </Grid>
        <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.name === adc && result.role === "Bot").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.kills , result.assists , result.deaths , result.teamTotalKills , result.creepScore, result.visionScore
              )), 0
            )
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
              if (result.name === support && result.role === "Support") {
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
                  <p>points: {calculatePlayerScore(
                    result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
                  )}</p>
                </div>
               )
              }
})}
          </div>

        
        </Grid>
     <h1>total points</h1>
        {
            playerresults.filter((result: any) => result.name === support && result.role === "Support").reduce(
              (acc: number, result: any) => acc + Number(calculatePlayerScore(
                result.kills , result.assists , result.deaths , result.teamTotalKills , result.creepScore, result.visionScore
              )), 0
            )
        }
        <h1>number of games</h1>
        {
          playerresults.filter((result: any) => result.name === support && result.role === "Support").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
      </div>
    </Grid>
  </>)

}


export default PlayerResults;
