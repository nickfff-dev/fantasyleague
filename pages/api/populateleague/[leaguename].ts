import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import { Fixture, Teams, League, Players, Participant, TeamResult} from "@prisma/client"
import dayjs from 'dayjs';
import { getPrivateLeagueResults, getPrivateLeagueMatches,getPrivateLeaguePlayers } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 


  const leaguename = req.query.leaguename as string;
  const fantasyname = JSON.parse(req.body).fantasyname as string;
  
  const league = await prisma.league.findUnique({
    where: {
      name: leaguename
    }
  }).then((data) => { 

    return data
  })

  const participant = await prisma.participant.findUnique({
    where: {
      fantasyname: fantasyname
    }
  }).then((data) => { 
      
      return data
  })



  if (league) {

    try {
      getPrivateLeagueResults(league?.startDate as string, league?.endDate as string, league?.region as string).then(data => {

        if (data) {
         
          data.forEach(async (result) => {
            const playerResults = await prisma.playerResult.findUnique({
              where: {
                name_game: {
                  name: result.Link,
                  game: result.GameId
                }
              }
            })
            if (playerResults) {
              if ((result.Link === participant?.top && result.Role === "Top") || (result.Link === participant?.jungle && result.Role === "Jungle") || (result.Link === participant?.mid && result.Role === "Mid") || (result.Link === participant?.adc && result.Role === "Bot") || (result.Link === participant?.support && result.Role === "Support")) {
                await prisma.league.update({
                  where: {
                    id: league.id
                  },
                  data: {
                    PlayerResult: {
                      update: {
                        where: {
                          name_game: {
                            name: result.Link,
                            game: result.GameId
                          }
                        },
                        data: {
                          creepScore: result.CS,
                          visionScore: result.VisionScore,
                          kills: result.Kills,
                          deaths: result.Deaths,
                          assists: result.Assists,
                          teamTotalKills: result.TeamKills,
                          points: Math.ceil(Number(calculatePlayerScore(result.Kills, result.Deaths, result.Assists, result.CS, result.VisionScore, result.TeamKills)))
                        }
                      }
                    }
                  }
                })
             }
            } else {
              if ((result.Link === participant?.top && result.Role === "Top") || (result.Link === participant?.jungle && result.Role === "Jungle") || (result.Link === participant?.mid && result.Role === "Mid") || (result.Link === participant?.adc && result.Role === "Bot") || (result.Link === participant?.support && result.Role === "Support")) {
                await prisma.league.update({
                  where: {
                    id: league.id
                  },
                  data: {
                    PlayerResult: {
                      create: {
                        name: result.Link,
                        role: result.Role,
                        team: result.Team,
                        game: result.GameId,
                        date: dayjs(result.DateTime_UTC).toDate().toISOString(),
                        creepScore: result.CS,
                        visionScore: result.VisionScore,
                        kills: result.Kills,
                        deaths: result.Deaths,
                        assists: result.Assists,
                        teamTotalKills: result.TeamKills,
                        participantId: participant?.id,
                        points: Math.ceil(Number(calculatePlayerScore(result.Kills, result.Deaths, result.Assists, result.CS, result.VisionScore, result.TeamKills)))
                      }
                    }
                  }
                })
              }
  
            }
            
  
  
          })
  
        } 
      }).then(() => {
        getPrivateLeagueMatches(league?.startDate as string, league?.endDate as string, league?.region as string).then((matches) => {
          if (matches) {
            matches.forEach(async (matchres) => {

              const matchResult1 = await prisma.teamResult.findUnique({
                where: {
                  name_game: {
                    name: matchres.Team1,
                    game: matchres.GameId
                  }
                }
              })

              const matchResult2 = await prisma.teamResult.findUnique({
                where: {
                  name_game: {
                    name: matchres.Team2,
                    game: matchres.GameId
                  }
                }
              })

              if (matchResult1) {
                if (matchres.Team1 === participant?.team) {
                  await prisma.league.update({
                    where: {
                      id: league.id
                    },
                    data: {
                      TeamResult: {
                        update: {
                          where: {
                            name_game: {
                              name: matchres.Team1,
                              game: matchres.GameId
                            },

                          },
                          data: {
    
                          

                            teamKills: matchres.Team1Kills,
                            dragonKills: matchres.Team1Dragons,
                            riftHeraldKills: matchres.Team1RiftHeralds,
                            turretKills: matchres.Team1Towers,
                            baronKills: matchres.Team1Barons,
                            inhibitorKills: matchres.Team1Inhibitors,
                         


                         
                            didWin: matchres.Winner === 1 ? true : false,
                            points: calculateTeamScore(
                              matchres.Team1Dragons, matchres.Team1Barons, matchres.Team1RiftHeralds, matchres.Team1Inhibitors, matchres.Team1Kills, matchres.Team1Towers, matchres.Winner === 1 ? true : false
                              
                            )

                          }
                        }
                      }
                    }
                  })
                }
              } else if (matchResult2) {
                if (matchres.Team2 === participant?.team) {
              
                  await prisma.league.update({
                    where: {
                      id: league.id
                    },
                    data: {
                      TeamResult: {
                        update: {
                          where: {
                            name_game: {
                              name: matchres.Team2,
                              game: matchres.GameId
                            },
  
                          },
                          data: {
      
                            
  
                            teamKills: matchres.Team2Kills,
                            dragonKills: matchres.Team2Dragons,
                            riftHeraldKills: matchres.Team2RiftHeralds,
                            turretKills: matchres.Team2Towers,
                            baronKills: matchres.Team2Barons,
                            inhibitorKills: matchres.Team2Inhibitors,
                           
  
  
                           
                            didWin: matchres.Winner === 2 ? true : false,
                            points: calculateTeamScore(
                              matchres.Team2Dragons, matchres.Team2Barons, matchres.Team2RiftHeralds, matchres.Team2Inhibitors, matchres.Team2Kills, matchres.Team2Towers, matchres.Winner === 2 ? true : false
                                
                            )
  
                          }
                        }
                      }
                    }
                  })
                }
  
                
              }
              else {
                if (matchres.Team1 === participant?.team || matchres.Team2 === participant?.team) {
                  await prisma.league.update({
                    where: {
                      id: league.id
                    },
                    data: {
                      TeamResult: {
                        create: {
                          name: matchres.Team1,
                          game: matchres.GameId,
                          date: dayjs(matchres.DateTime_UTC).toDate().toISOString(),
                          teamKills: matchres.Team1Kills,
                          dragonKills: matchres.Team1Dragons,
                          riftHeraldKills: matchres.Team1RiftHeralds,
                          turretKills: matchres.Team1Towers,
                          baronKills: matchres.Team1Barons,
                          inhibitorKills: matchres.Team1Inhibitors,
                          didWin: matchres.Winner === 1 ? true : false,
                          participantId: participant?.id,
                          points: calculateTeamScore(
                            matchres.Team1Dragons, matchres.Team1Barons, matchres.Team1RiftHeralds, matchres.Team1Inhibitors, matchres.Team1Kills, matchres.Team1Towers, matchres.Winner === 1 ? true : false
                          
                          )

                        }
                      }
                    }
                  }).then(async () => {
                    await prisma.league.update({
                      where: {
                        id: league.id
                      },
                      data: {
                        TeamResult: {
                          create: {
                            name: matchres.Team2,
                            game: matchres.GameId,
                            date: dayjs(matchres.DateTime_UTC).toDate().toISOString(),
                            teamKills: matchres.Team2Kills,
                            dragonKills: matchres.Team2Dragons,
                            riftHeraldKills: matchres.Team2RiftHeralds,
                            turretKills: matchres.Team2Towers,
                            baronKills: matchres.Team2Barons,
                            inhibitorKills: matchres.Team2Inhibitors,
                            didWin: matchres.Winner === 2 ? true : false,
                            participantId: participant?.id,
                            points: calculateTeamScore(
                            matchres.Team2Dragons, matchres.Team2Barons, matchres.Team2RiftHeralds, matchres.Team2Inhibitors, matchres.Team2Kills, matchres.Team2Towers, matchres.Winner === 2 ? true : false
                            
                            )
  
                          }
                        }
                      }
                    })
                  
                  })
                }
              }

     
            })
          }
        })
      })

        res.status(200).json("players updated")
    

      



    
     } catch (error) {
      console.log(error)
    };


    

  }


}
