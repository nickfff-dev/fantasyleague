
import d from "./resultDetail.module.css"
import playpic from "../../avatar.png"

import {useEffect, useState} from 'react';
import { cursorTo } from "readline";
import { calcParticipationPts } from "@lib/calculate";

const ResultDetail = ({ results, participant, league, closeModal }: { results: any, participant: any, league: any, closeModal:any }) => {
  const [show, setShow] = useState(false)
  const showDropwdwn = () => {
    setShow(!show)
     
   }
  const calcweeks = () => { 
    let theweeks: any[] = []
    league.fixtures.map((fixture: any) => {
      theweeks.push(fixture.MatchId.split("_")[1])
    })

    return theweeks.filter((week: any, index: any) => theweeks.indexOf(week) === index)
}
  const [weeks, setWeeks] = useState([
    ...calcweeks()
  ])

  const fantasyRoster = ["Top", "Jungle", "Mid", "Bot", "Support",]
  // group all the results by week ie. week 9, week 10, week 11
  const teamGroupedResults = () => {
    var reduced = []
   
    for (let i = 0; i < weeks.length; i++) { 
      var name = ""
      var teamKills = 0
      var dragonKills = 0
      var riftHeraldKills = 0
      var baronKills = 0
      var turretKills = 0
      var inhibitorKills = 0
      var win = false
      var points = 0
      var kills = 0

      results.participantteam?.map((result: any) => { 
        if (result.name === participant.team && result.game.split("_")[1] === weeks[i]) {
          name = result.name
          teamKills += result.teamKills
          dragonKills += result.dragonKills
          riftHeraldKills += result.riftHeraldKills
          baronKills += result.baronKills
          turretKills += result.turretKills
          inhibitorKills += result.inhibitorKills
          win = result.didWin
          points += result.points
          kills += result.teamKills
        }
      })
      reduced.push({name: name, week: weeks[i],  teamKills: teamKills, dragonKills: dragonKills, riftHeraldKills: riftHeraldKills, baronKills: baronKills, turretKills: turretKills, inhibitorKills: inhibitorKills, win: win, points: points, kills: kills})
    }

    return reduced

  }

  const [teamResults, setTeamResults] = useState(teamGroupedResults())
  const groupedResults = () => {

    var grouped: any[] = []
    weeks.map((fixture: any) => {
        
      for (let i = 0; i < fantasyRoster.length; i++) {
        results.participantplayer?.filter((result: any) => {
          if (result.role === fantasyRoster[i] && result.matchId.split("_")[1] === fixture) {
         
            grouped.push(result)
          
          
          }
        })
      

      }
      

    })
    return grouped
  }

  const reduceResultsByweek = () => {
    var grouped = groupedResults()
    var roles = ["Top", "Jungle", "Mid", "Bot", "Support"]
    var reduced: any[] = []
    roles.forEach((role: any) => {
      for (let i = 0; i < weeks.length; i++){
        
        var kills = 0
        var deaths = 0
        var assists = 0
        var cs = 0
        var vision = 0
        var killp = 0
        var name = ""
        var team = ""
        var points= 0
        var teamTotalKills = 0
        grouped.forEach((result: any) => {
          if (result.role === role && result.matchId.split("_")[1] === weeks[i]) {
            kills += result.kills
            deaths += result.deaths
            assists += result.assists
            cs += result.creepScore
            vision += result.visionScore
            killp +=  Number(calcParticipationPts(result.kills, result.assists, result.teamTotalKills))
            teamTotalKills += result.teamTotalKills
            name = result.name
            points += result.points
            team = result.team
          }
        })
        reduced.push({name:name, team:team ,points: points, role: role, week: weeks[i], kills: kills, deaths: deaths, assists: assists, cs: cs, vision: vision, killp: killp})
      }
    })

    return reduced

  }
  const [playerResults, setPlayerResults] = useState(reduceResultsByweek())
  const[activeWeek, setActiveWeek] = useState(weeks[0])
 
  
  return (
    <div className={`${d.root} z-20 absolute modal shadow-primary fixed top-10 left-0 right-0 shadow-md`}>
      <div className={`${d.resultsHeader}`}>
        <p>{participant.username}</p>
        <p>{participant.fantasyname}</p>
        {/* create a dropdown for toggling week */}
         

         
        <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider" className="text-white   font-medium rounded-lg text-sm  text-center inline-flex items-center" type="button">Week : <span className={`${d.dj}`}>{ activeWeek}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>

<div id="dropdownDivider" className={`${show ? "z-20" : "hidden"} absolute z-20 ml-[200px] mt-5 max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
    <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              {weeks.map((week: any, index: any) => {
                return (
                  <li>
                    <button onClick={
                      () => { 
                        setActiveWeek(week)
                        setShow(false)
                      }
                  }  className="inline py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{week}</button>
                </li>
            )
       })}
    </ul>
 
</div>

        <button className="absolute top-3 right-2.5 ml-auto inline-flex items-center" onClick={closeModal}
><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</button>
        
      </div>

      <div className={`${d.resultsContainer} `}>
 
        {
          playerResults.filter((player: any) => { if (player.week === activeWeek) { return player } }).map((player: any, index:any) => {
            return (
              <div key={index} className={`${d.singleRole}`}>
              <div className={`${d.singleRowHead}`}>
    
                <div className={`${d.singleRowHeadIn}`}>
                  <img src="https://i.redd.it/rtqwmwm3tdy41.png" className="w-12 h-12" /> 
                  <div className={`${d.coltitles}`}>
                    <h1>{`${player.name.split(" ")[0]}`}</h1>
                      <span>{player.team}</span>
                    <p>{player.role}</p>
                  </div>
                </div>
                <div className={`${d.singleRowHeadb}`}>
                  <p>TOTAL: <span>{Math.ceil(player.points)}</span></p>
                </div>
              </div>
              <div className={`${d.singleRoleRow1}`} >
                <p>stat</p>
                <p>score</p>
              </div>
    
              <div className={`${d.singleRoleRow}`} >
                <p>Kills</p>
                <p>{player.kills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Deaths</p>
                <p>{player.deaths}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Assists</p>
                  <p>{player.assists}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>CS</p>
                <p>{player.cs}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Vision</p>
                <p>{player.vision}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Kill %</p>
                  <p>{
                    Math.ceil(player.killp)
                  }</p>
              </div>
              
            </div>
            )
          })
        }{
          teamResults.filter((team: any) => { if (team.week === activeWeek) { return team } }).map((team: any, index: any) => { 
            return (
              <div key={index} className={`${d.singleRole}`}>
              <div className={`${d.singleRowHead}`}>
    
                <div className={`${d.singleRowHeadIn}`}>
                  <img src="https://i.redd.it/rtqwmwm3tdy41.png" className="w-12 h-12" /> 
                  <div className={`${d.coltitles}`}>
                    <h1>{team.name.split(" ")[0]}</h1>
                      <span>{ league.region}</span>
                    <p>Team</p>
                  </div>
                </div>
                <div className={`${d.singleRowHeadb}`}>
                <p>TOTAL: <span>{Math.ceil(team.points)}</span></p>
                </div>
              </div>
              <div className={`${d.singleRoleRow1} `} >
                <p>stat</p>
                <p>score</p>
              </div>
    
              <div className={`${d.singleRoleRow}`} >
                <p>Towers</p>
                <p>{team.turretKills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Inhibs</p>
                <p>{team.inhibitorKills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Dragons</p>
                  <p>{team.dragonKills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Rifts</p>
                <p>{team.riftHeraldKills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>Barons</p>
                <p>{team.baronKills}</p>
              </div>
              <div className={`${d.singleRoleRow}`} >
                <p>win</p>
                  <p>{
                    team.win ? "Yes" : "No"
                  }</p>
              </div>
              
            </div>
            )
          })
     }
        
      

      </div>

    </div>
  )

}


export default ResultDetail
