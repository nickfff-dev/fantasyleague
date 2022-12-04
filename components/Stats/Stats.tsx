import { useState, useEffect } from 'react';
import Lt from "./stats2.module.css"
import { calcParticipationPts } from "lib/calculate";
import StatsViewPlayers from "./StatsViewPlayers";
import StatsViewTeams from "./StatsViewTeams";
const Stats = ({ statistics }: { statistics: any }) => {

  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
      document.getElementById("games")?.scrollBy(10, 0)
    })
  })

  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [mode, setMode] = useState("scores")
  const showDropwdwn = (id: any) => {
    if (id === "dropdownDivider1") {
      setShow1(!show1)
    }
    if (id === "dropdownDivider2") {
      setShow2(!show2)
    }
    if (id === "dropdownDivider3") {
      setShow3(!show3)
    }
    if (id === "dropdownDivider4") {
      setShow4(!show4)
    }
  }


  const [role, setRole] = useState("")
  const [region, setRegion] = useState("")
  const [view, setView] = useState("Players")
  const [season, setSeason] = useState(" Summer Season")
  var groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const filterteamdata = () => {
    var teamstats: { leaguname: any, name: any; towers: any, inhibitors: any, dragons: any, rift: any, baron: any, totalKill: any, region: any; win: any; split: any; points: any[]; }[] = []
    statistics.map((league: any) => {

      league.TeamResult.map((result: any) => {

        teamstats.push({
          leaguname: league.name,
          name: result.name,
          region: league.region,
          towers: result.turretKills,
          inhibitors: result.inhibitorKills,
          dragons: result.dragonKills,
          rift: result.riftHeraldKills,
          baron: result.baronKills,
          split: result.game,
          points: result.points,
          totalKill: result.teamKills,
          win: result.didWin

        })



      })


    })



    return teamstats
  }



  const filterdata = () => {
    var playerstats: { leaguname: any, name: any; kills: any, deaths: any, assists: any, cs: any, vs: any, teamTotal: any, region: any; team: any; role: any; split: any; points: any[]; }[] = []
    statistics.map((league: any) => {

      league.PlayerResult.map((result: any) => {

        playerstats.push({
          leaguname: league.name,
          name: result.name,
          region: league.region,
          team: result.team,
          role: result.role,
          split: result.game,
          kills: result.kills,
          deaths: result.deaths,
          assists: result.assists,
          cs: result.creepScore,
          vs: result.visionScore,
          teamTotal: Math.ceil(calcParticipationPts(result.kills, result.assists, result.teamTotalKills)),
          points: result.points
        })



      })


    })



    return playerstats
  }

  const assignTeamData = () => {
    const teamdata = filterteamdata()
    const groupdteamdata = Object.entries(groupBy(teamdata, "name")).map(([key, value]) => ({ key, value }))
    return groupdteamdata
  }

  const runFilterTeams = () => {
    const unfilt = filterteamdata()
    const empunfilt: any[] = []
    if (region !== "" && season !== "") {
      unfilt.map((team: any) => {
        if (team.region === region) {
          empunfilt.push(team)
        }
      })
    }

    const outcome = Object.entries(groupBy(empunfilt, "name")).map(([key, value]) => ({ key, value }))
    console.log(outcome)
    setTeamStats(outcome)
  }


  const assignData = () => {
    const mres = filterdata()
    const tuma = Object.entries(groupBy(mres, "name")).map(([key, value]) => ({ key, value }))
    return tuma
  }
  const [stats, setStats] = useState(assignData())
  const [teamStats, setTeamStats] = useState(assignTeamData())
  const runFilter = (region: string, role: string) => {
    const unfilt = filterdata()
    const empunfilt: any[] = []
    if (region !== "" && role !== "") {
      unfilt.map((play: any) => {
        if (play.region === region && play.role === role) {
          empunfilt.push(play)
        }
      })
    } else if (region !== "" && role === "") {
      unfilt.map((play: any) => {
        if (play.region === region) {
          empunfilt.push(play)
        }
      })
    } else if (region === "" && role !== "") {
      unfilt.map((play: any) => {
        if (play.role === role) {
          empunfilt.push(play)
        }
      })
    }

    const tuma = Object.entries(groupBy(empunfilt, "name")).map(([key, value]) => ({ key, value }))

    setStats(tuma)

  }




  useEffect(() => {
    if (region !== "" || role !== "") {
      runFilter(region, role)
    }
  }, [region, role])

  useEffect(() => {
    if (view === "Teams" && region !== "" && season !== "") {
      runFilterTeams()
    }

  }, [view, region, season])

  return (<div className="overflow-x-hidden m-5" >
    <div className="grid grid-cols-9  auto-cols-auto space-x-5 mt-3 ml-3 space-x-12">
      <div className="grid grid-flow-col grid-cols-2 col-span-2  space-x-3 "> 
        <button className={`${Lt.scorefilter}`} onClick={() => {
          setMode("scores")
        }}><span>SCORE</span></button>
        <button className={`${Lt.scorefilter}`} onClick={() => {
          setMode("stats")
        }}><span>STATS</span></button>
      </div>
      <div className="col-span-1">
        
      </div>
      <div className="col-span-6 grid grid-flow-col items-center justify-items-center" >
        <span>
          <button id="dropdownDividerButton" onClick={() => {
            showDropwdwn("dropdownDivider1")
          }}
            data-dropdown-toggle="dropdownDivider1" className="font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">View : <span className={`${Lt.filtnam} pl-2 capitalize`}>{view}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider1" className={`${show1 ? "z-20" : "hidden"} absolute z-20 w-32 ml-2 text-center bg-white max-w-40  rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
            <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              <li> <button onClick={() => {
                setView("Players");
                setShow1(false)
              }}
                className="inline py-2 px-4 uppercase">players</button>
              </li>
              <li>
                <button onClick={() => {
                  setView("Teams");
                  setShow1(false)

                }}
                  className="inline py-2 px-4 uppercase ">teams</button>
              </li>

            </ul>
          </div></span>


        <span>
          <button id="dropdownDividerButton" onClick={() => {
            showDropwdwn("dropdownDivider2")
          }} data-dropdown-toggle="dropdownDivider2" className="font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">SPLIT : <span className={`${Lt.filtnam} pl-2 capitalize`} >2022 {season}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider2" className={`${show2 ? "z-20" : "hidden"} absolute z-20 ml-20 w-40 mt-2 text-center max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
            <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">

              <li>
                <button onClick={() => {
                  setSeason(" SUMMER SEASON");
                  setShow2(false)
                }}
                  className="inline py-2 px-4 ">SUMMER SEASON</button>
              </li>
              <li>
                <button onClick={() => {
                  setSeason(" SPRING SEASON");
                  setShow2(false)
                }}
                  className="inline py-2 px-4 ">SPRING SEASON</button>
              </li>


            </ul>
          </div></span>

        <span>
          <button id="dropdownDividerButton" onClick={() => {
            showDropwdwn("dropdownDivider3")
          }} data-dropdown-toggle="dropdownDivider3" className="font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">Region : <span className={`${Lt.filtnam} pl-2 capitalize`} >{region}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider3" className={`${show3 ? "z-20" : "hidden"} absolute z-20    w-24 max-w-24 text-center bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
            <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">

              <li>
                <button onClick={() => {
                  setRegion("LCS");
                  setShow3(false)
                }}
                  className="inline py-2 px-4 ">LCS</button>
              </li>
              <li>
                <button onClick={() => {
                  setRegion("LEC");
                  setShow3(false)
                }}
                  className="inline py-2 px-4 ">LEC</button>
              </li>
              <li>
                <button onClick={() => {
                  setRegion("LCK");
                  setShow3(false)
                }}
                  className="inline py-2 px-4 ">LCK</button>
              </li>
              <li>
                <button onClick={() => {
                  setRegion("LPL");
                  setShow3(false)
                }}
                  className="inline py-2 px-4 ">LPL</button>
              </li>

            </ul>
          </div></span>

        <span>
          <button id="dropdownDividerButton" onClick={() => {
            showDropwdwn("dropdownDivider4")
          }} data-dropdown-toggle="dropdownDivider4" className="   font-medium rounded-lg text-sm  text-center inline-flex items-center text-white text-lg font-bold uppercase" type="button">Role : <span className={`${Lt.filtnam} pl-2 capitalize`} >{role}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider4" className={`${show4 ? "z-20" : "hidden"} absolute z-20   w-22  text-center max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
            <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              <li> <button onClick={() => { setRole("Top"); setShow4(false) }}
                className="inline py-2 px-4 ">Top</button>
              </li>
              <li>
                <button onClick={() => {
                  setRole("Mid");
                  setShow4(false)

                }}
                  className="inline py-2 px-4 ">Mid</button>
              </li>
              <li>
                <button onClick={() => {
                  setRole("Jungle");
                  setShow4(false)
                }}

                  className="inline py-2 px-4 ">Jungle</button>
              </li>
              <li>
                <button onClick={() => {
                  setRole("Support");
                  setShow4(false)
                }}
                  className="inline py-2 px-4 ">Support</button>
              </li>
              <li>
                <button onClick={() => {
                  setRole("Bot");
                  setShow4(false)
                }}
                  className="inline py-2 px-4 ">Bot</button>
              </li>

            </ul>
          </div></span>
        <input type="text" placeholder="Search Here..." className={`${Lt.searchbar}`} />
      </div></div>
    {
      view === "Players" ? < StatsViewPlayers stats={stats} mode={mode} /> : <StatsViewTeams stats={teamStats} mode={mode} />
    }

  </div>)
}


export default Stats

