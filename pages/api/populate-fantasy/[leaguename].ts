import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import { Fixture, Teams, League, Players, Participant, TeamResult, PrismaClient, Prisma} from "@prisma/client"
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
    const playerdata = await getPrivateLeagueResults(league?.startDate as string, league?.endDate as string, league?.region as string)
    const teamdata = await getPrivateLeagueMatches(league?.startDate as string, league?.endDate as string, league?.region as string)

    playerdata?.map(async (team: any) => { 
      if ((team.Link === participant?.top && team.Role === "Top") || (team.Link === participant?.jungle && team.Role === "Jungle") || (team.Link === participant?.mid && team.Role === "Mid") || (team.Link === participant?.adc && team.Role === "Bot") || (team.Link === participant?.support && team.Role === "Support")) {
       
         await prisma.playerResult.upsert({
            where: {
              name_game_participantId: {
                name: team.Link,
                game: team.GameId,
                participantId: participant?.id as number,
              }
            },
            create: {
              name: team.Link,
              game: team.GameId,
              role: team.Role,
              team: team.Team,
              kills: team.Kills,
              deaths: team.Deaths,
              assists: team.Assists,
              creepScore: team.CreepScore,
              visionScore: team.VisionScore,
              teamTotalKills: team.TeamKills,
              participantId: participant?.id as number,
              points: Number(calculatePlayerScore(team.Kills, team.Assists, team.Deaths, team.CS, team.VisionScore, team.TeamKills)),
              league: {
                connect: {
                  name: leaguename
                }
              },
            },
            update: {
              kills: team.Kills,
              deaths: team.Deaths,
              assists: team.Assists,
              creepScore: team.CreepScore,
              visionScore: team.VisionScore,
              teamTotalKills: team.TeamKills,

            }
          })
        

      }

    })

    teamdata?.map(async (team: any) => { 
      if (team.Team1 === participant?.team) {

         await prisma.teamResult.upsert({
            where: {
              name_game_participantId: {
                name: team.Team1,
                game: team.GameId,
                participantId: participant?.id as number,
              }
            },
            create: {
              name: team.Team1,
              game: team.GameId,
              date: dayjs(team.DateTime_UTC).toDate().toISOString(),
              teamKills: team.Team1Kills,
              dragonKills: team.Team1Dragons,
              riftHeraldKills: team.Team1RiftHeralds,
              turretKills: team.Team1Towers,
              baronKills: team.Team1Barons,
              inhibitorKills: team.Team1Inhibitors,
              didWin: team.Winner === 1 ? true : false,
              participantId: participant?.id as number,
              points: calculateTeamScore(
                team.Team1Kills, team.Team1Dragons, team.Team1RiftHeralds, team.Team1Towers, team.Team1Inhibitors, team.Team1Barons, team.Winner === 1 ? true : false
                
              ),
              league: {
                connect: {
                  name: leaguename
                }
              }
              
            },
            update: {
              teamKills: team.Team1Kills,
              dragonKills: team.Team1Dragons,
              riftHeraldKills: team.Team1RiftHeralds,
              turretKills: team.Team1Towers,
              baronKills: team.Team1Barons,
              inhibitorKills: team.Team1Inhibitors,
              didWin: team.Winner === 1 ? true : false,
              points: calculateTeamScore(
                team.Team1Kills, team.Team1Dragons, team.Team1RiftHeralds, team.Team1Towers, team.Team1Inhibitors, team.Team1Barons, team.Winner === 1 ? true : false
                
              ),
              
            }
          })
        
      } else if (team.Team2 === participant?.team) { 
      
        await  prisma.teamResult.upsert({
            where: {
              name_game_participantId: {
                name: team.Team2,
                game: team.GameId,
                participantId: participant?.id as number,
              }
            },
            create: {
              name: team.Team2,
              game: team.GameId,
              date: dayjs(team.DateTime_UTC).toDate().toISOString(),
              teamKills: team.Team2Kills,
              dragonKills: team.Team2Dragons,
              riftHeraldKills: team.Team2RiftHeralds,
              turretKills: team.Team2Towers,
              baronKills: team.Team2Barons,
              inhibitorKills: team.Team2Inhibitors,
              didWin: team.Winner === 2 ? true : false,
              participantId: participant?.id as number,
              points: calculateTeamScore(
                team.Team2Kills, team.Team2Dragons, team.Team2RiftHeralds, team.Team2Towers, team.Team2Inhibitors, team.Team2Barons, team.Winner === 2 ? true : false
                
              ),
              league: {
                connect: {
                  name: leaguename
                }
              }
              
            },
            update: {
              teamKills: team.Team2Kills,
              dragonKills: team.Team2Dragons,
              riftHeraldKills: team.Team2RiftHeralds,
              turretKills: team.Team2Towers,
              baronKills: team.Team2Barons,
              inhibitorKills: team.Team2Inhibitors,
              didWin: team.Winner === 2 ? true : false,
              points: calculateTeamScore(
                team.Team2Kills, team.Team2Dragons, team.Team2RiftHeralds, team.Team2Towers, team.Team2Inhibitors, team.Team2Barons, team.Winner === 2 ? true : false
                
              ),
              
            }
          })
        
      }

    })


    const playerres = await prisma.playerResult.findMany({
      where: {
        participantId: participant?.id
      }
    })

    const teamres = await prisma.teamResult.findMany({
      where: {
        participantId: participant?.id
      }
    })

    res.status(200).json(JSON.stringify({playerres, teamres}))
   
  }

}
