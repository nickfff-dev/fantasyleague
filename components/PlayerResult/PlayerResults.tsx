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



const PlayerResults = ({  top, jungle, mid, adc, support, leaguename,  teamname, fantasyname, smdata }: {  top: String,leaguename:String, mid: String,jungle: String,adc: String,support: String, teamname: String, fantasyname:String, smdata: any  }) => { 
  // const [playerresults, setPlayerResults] = useState<any>([]);
  // const [results, setResults] = useState<any>([]);
  // const [resultLoaded, setResultLoaded] = useState<boolean>(false);


  // const getResults = async () => {
  //    await fetch(`/api/populate-fantasy/${leaguename}/`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       fantasyname: fantasyname,
  //     }),
  //   }).then((res) =>
  //     res.json().then((data) => { 
        
  //       setResults(JSON.parse(data).teamres);
  //       setPlayerResults(JSON.parse(data).playerres);
  //       setResultLoaded(true);
  //     })   
  //   );
  
   
  // }
  // useEffect(() => { 
 
  //    if (resultLoaded === false  ) {
  //     getResults();
  //   } 
  // }, [resultLoaded])
  

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }


  const updateResults = async () => {
    
    refreshData()
    
  }

  const teamPPoints = (smarr: any) => {
    const teampoints = smarr?.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {

    return    acc + result.points
  
  
    }, 0)
   
    
    return teampoints
  }

  const calculateplayerpoints = (smarr: any) => {
    const toPPoints = smarr?.filter((result: any) => result.name === top && result.role === "Top").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const jgPPoints = smarr?.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const midPPoints = smarr?.filter((result: any) => result.name === mid && result.role === "Mid").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const adcPPoints = smarr?.filter((result: any) => result.name === adc && result.role === "Bot").reduce(
      (acc: number, result: any) => acc + result.points, 0
    )

    const supPPoints =smarr?.filter((result: any) => result.name === support && result.role === "Support").reduce(
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
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.name === top &&  result.role === "Top") {
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
            calculateplayerpoints(smdata.playerres).toPPoints
        }
        <h1>number of games</h1>
        {
           smdata.playerres?.filter((result: any) => result.name === top && result.role === "Top").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
             
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.name === jungle && result.role === "Jungle") {
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
            calculateplayerpoints(smdata.playerres).jgPPoints
        }
        <h1>number of games</h1>
        {
          smdata.playerres?.filter((result: any) => result.name === jungle && result.role === "Jungle").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.name === mid) {
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
            calculateplayerpoints(smdata.playerres).midPPoints
        }
        <h1>number of games</h1>
        {
          smdata.playerres?.filter((result: any) => result.name === mid && result.role === "Mid").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }

        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1800px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.name === adc ) {
                return (
                  <div className={s.item} key={index}>
                    <p>{result.role}<br /> {adc}</p>
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
             calculateplayerpoints(smdata.playerres).adcPPoints
        }
        <h1>number of games</h1>
        {
          smdata.playerres?.filter((result: any) => result.name === adc && result.role === "Bot").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
        <Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1500px"}}>
            {smdata.playerres?.map((result: any, index: number) => {
              if (result.name === support ) {
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
            calculateplayerpoints(smdata.playerres).supPPoints
        }
        <h1>number of games</h1>
        {
          smdata.playerres?.filter((result: any) => result.name === support && result.role === "Support").reduce(
            (acc: number, result: any) => acc + 1, 0
            )
        }
        
      </div>
    </Grid>
    <Grid>
      <div className={s.root}>
        <h1> Team Results </h1>
 
      
     
<Grid>
    <div className={s.root} style={{display:"flex", flexDirection: "row", width: "1500px"}}>
            {smdata.teamres?.map((result: any) => {
             
              if (result.name === teamname) {   
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
          smdata.teamres?.filter((result: any) => result.name === teamname ).reduce((acc: number, result: any) => {
            return acc + 1
          }, 0)
        }
        </div>
    
    </Grid>

    <Grid>
      <h1>total player points</h1>
      {
        calculateplayerpoints(
          smdata.playerres
        ).playerPointstotal  + teamPPoints(smdata.teamres)
      }
    </Grid>
  </>)

}


export default PlayerResults;
