import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import { Fixture, Teams, League, Players, Participant, TeamResult, PrismaClient, Prisma, PlayerResult } from "@prisma/client"
import dayjs from 'dayjs';
import { getPrivateLeagueResults, getPrivateLeagueMatches, getPrivateLeaguePlayers } from "@lib/cargoQueries";
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {

  function getPlayerTeam(playerarray: any[], playername: string) {
    const player = playerarray.find((player) => player.name === playername);
    return player.team;

  }

  const leaguename = req.query.leaguename as string;
  const fantasyname = JSON.parse(req.body).fantasyname as string;

  const league = await prisma.league.findUnique({
    where: {
      name: leaguename
    },
    include: {
      players: true,
      members: true,
      fixtures: true
    }

  }).then(async (data) => {
    await prisma.$disconnect();
    return data
  })

  const participant = league?.members.find((participant) => participant.fantasyname === fantasyname)
  



  if (league?.populateRosters === true) {
    const playerdata =await getPrivateLeagueResults(league?.startDate as string, league?.endDate as string, league?.region as string)
    const teamdata =  await getPrivateLeagueMatches(league?.startDate as string, league?.endDate as string, league?.region as string)
    var participantplayer: { name: any; game: any; matchId: any; role: any; team: any; date: string; kills: any; deaths: any; team1: any; team2: any; assists: any; creepScore: any; visionScore: any; teamTotalKills: any; participantId: number; points: number; }[] = []
    var participantteam: { name: string; game: string; date: string; teamKills: number, dragonKills: number, riftHeraldKills: number, turretKills: number; baronKills: number; team1: string; team2: string; inhibitorKills: number; didWin: boolean; participantId: number; points: number}[] = []
playerdata?.map(async (team: any) => {
      if (((team.Link === participant?.top && team.Role === "Top") || (team.Role === "Top" && team.Team === getPlayerTeam(league?.players, participant?.top as string)))
        || ((team.Link === participant?.jungle && team.Role === "Jungle") || (team.Role === "Jungle" && team.Team === getPlayerTeam(league?.players, participant?.jungle as string)))
        || ((team.Link === participant?.mid && team.Role === "Mid") || (team.Role === "Mid" && team.Team === getPlayerTeam(league?.players, participant?.mid as string)))
        || ((team.Link === participant?.adc && team.Role === "Bot") || (team.Role === "Bot" && team.Team === getPlayerTeam(league?.players, participant?.adc as string)))
        || ((team.Link === participant?.support && team.Role === "Support") || (team.Role === "Support" && team.Team === getPlayerTeam(league?.players, participant?.support as string)))


      ) {
      
      participantplayer.push( { name: team.Link,
        game: team.GameId,
        matchId: team.MatchId,
        role: team.Role,
        team: team.Team,
        date: dayjs(team.DateTime_UTC).toDate().toISOString(),
        kills: team.Kills,
        deaths: team.Deaths,
        team1: team.Team1,
        team2: team.Team2,
        assists: team.Assists,
        creepScore: team.CS,
        visionScore: team.VisionScore,
        teamTotalKills: team.TeamKills,
        participantId: participant?.id as number,
        points: Number(calculatePlayerScore(team.Kills, team.Assists, team.Deaths, team.CS, team.VisionScore, team.TeamKills))})
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
            date: dayjs(team.DateTime_UTC).toDate().toISOString(),
            kills: team.Kills,
            deaths: team.Deaths,
            team1: team.Team1,
            team2: team.Team2,
            assists: team.Assists,
            creepScore: team.CS,
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
            date: dayjs(team.DateTime_UTC).toDate().toISOString(),
            creepScore: team.CS,
            visionScore: team.VisionScore,
            teamTotalKills: team.TeamKills,
            points: Number(calculatePlayerScore(team.Kills, team.Assists, team.Deaths, team.CS, team.VisionScore, team.TeamKills)),


          }
        }).then(async () => {
          await prisma.$disconnect();

        })

      }

    })

    teamdata?.map(async (team: any) => {
      if (team.Team1 === participant?.team) {


        participantteam.push({
          name: team.Team1,
          game: team.GameId,
          date: dayjs(team.DateTime_UTC).toDate().toISOString(),
          teamKills: team.Team1Kills,
          dragonKills: team.Team1Dragons,
          riftHeraldKills: team.Team1RiftHeralds,
          turretKills: team.Team1Towers,
          baronKills: team.Team1Barons,
          team1: team.Team1,
          team2: team.Team2,
          inhibitorKills: team.Team1Inhibitors,
          didWin: team.Winner === 1 ? true : false,
          participantId: participant?.id as number,
          points: Number(calculateTeamScore(
            team.Team1Kills, team.Team1Dragons, team.Team1RiftHeralds, team.Team1Towers, team.Team1Inhibitors, team.Team1Barons, team.Winner === 1 ? true : false

          ))
        })
        
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
            team1: team.Team1,
            team2: team.Team2,
            inhibitorKills: team.Team1Inhibitors,
            didWin: team.Winner === 1 ? true : false,
            participantId: participant?.id as number,
            points: Number(calculateTeamScore(
              team.Team1Kills, team.Team1Dragons, team.Team1RiftHeralds, team.Team1Towers, team.Team1Inhibitors, team.Team1Barons, team.Winner === 1 ? true : false

            )),
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
            points: Number(calculateTeamScore(
              team.Team1Kills, team.Team1Dragons, team.Team1RiftHeralds, team.Team1Towers, team.Team1Inhibitors, team.Team1Barons, team.Winner === 1 ? true : false

            )),

          }
        }).then(async () => {
          await prisma.$disconnect();

        })
      } else if (team.Team2 === participant?.team) {
        participantteam.push({name: team.Team2,
          game: team.GameId,
          date: dayjs(team.DateTime_UTC).toDate().toISOString(),
          teamKills: team.Team2Kills,
          dragonKills: team.Team2Dragons,
          riftHeraldKills: team.Team2RiftHeralds,
          turretKills: team.Team2Towers,
          baronKills: team.Team2Barons,
          team1: team.Team1,
          team2: team.Team2,
          inhibitorKills: team.Team2Inhibitors,
          didWin: team.Winner === 2 ? true : false,
          participantId: participant?.id as number,
          points: Number(calculateTeamScore(
            team.Team2Kills, team.Team2Dragons, team.Team2RiftHeralds, team.Team2Towers, team.Team2Inhibitors, team.Team2Barons, team.Winner === 2 ? true : false

          ))
        })
        
        await prisma.teamResult.upsert({
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
            team1: team.Team1,
            team2: team.Team2,
            date: dayjs(team.DateTime_UTC).toDate().toISOString(),
            teamKills: team.Team2Kills,
            dragonKills: team.Team2Dragons,
            riftHeraldKills: team.Team2RiftHeralds,
            turretKills: team.Team2Towers,
            baronKills: team.Team2Barons,
            inhibitorKills: team.Team2Inhibitors,
            didWin: team.Winner === 2 ? true : false,
            participantId: participant?.id as number,
            points: Number(calculateTeamScore(
              team.Team2Kills, team.Team2Dragons, team.Team2RiftHeralds, team.Team2Towers, team.Team2Inhibitors, team.Team2Barons, team.Winner === 2 ? true : false

            )),
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
            team1: team.Team1,
            team2: team.Team2,
            baronKills: team.Team2Barons,
            inhibitorKills: team.Team2Inhibitors,
            didWin: team.Winner === 2 ? true : false,
            points: Number(calculateTeamScore(
              team.Team2Kills, team.Team2Dragons, team.Team2RiftHeralds, team.Team2Towers, team.Team2Inhibitors, team.Team2Barons, team.Winner === 2 ? true : false

            )),

          }
        }).then(async () => {
          await prisma.$disconnect();

        })
      }

    })



    
    if (participantplayer && participantteam) {
     
      if (league.region !== "LCK") {
        res.status(200).json(JSON.stringify({ participantplayer, participantteam }))
        const totalpoints = participantplayer?.reduce((a, b: any) => a + b.points, 0) + participantteam?.reduce((a, b: any) => a + b.points, 0)
      
      await prisma.participant.update({
        where: {
          id: participant?.id as number
        },
        data: {
          points: totalpoints
        }
      }).then(async () => {
        await prisma.$disconnect();
      })
      } else {
        var totallckpoints: number[] = []
        var roles = ["Top", "Jungle", "Mid", "Bot", "Support"]
        var newplayerdata:{ name: any; game: any; matchId: any; role: any; team: any; date: string; kills: any; deaths: any; team1: any; team2: any; assists: any; creepScore: any; visionScore: any; teamTotalKills: any; participantId: number; points: number; }[] = []
      //  group playerdata with matchid then find the two highest points for each matchid and add themtogether
        league.fixtures.map(async (fixture: any) => {
          for (let i = 0; i < roles.length; i++) {
             
            participantplayer.filter((player: any) => player.role === roles[i] && player.matchId === fixture.MatchId).sort((a: any, b: any) => b.points - a.points).slice(0, 2).map((player: any) => { 

              newplayerdata.push(player)
            })
            totallckpoints.push(participantplayer.filter((player: any) => player.role === roles[i] && player.matchId === fixture.MatchId).sort((a: any, b: any) => b.points - a.points).slice(0,2).reduce ((a: any, b: any) => a + b.points, 0))
          }
          
        })
        res.status(200).json(JSON.stringify({ participantplayer: newplayerdata, participantteam }))
        const totalpoints = totallckpoints.reduce((a, b) => a + b, 0) + participantteam?.reduce((a, b: any) => a + b.points, 0)
        await prisma.participant.update({
          where: {
            id: participant?.id as number
          },
          data: {
            points: totalpoints
          }
        }) .then(async () => {
          await prisma.$disconnect();
        })
  }
  
      
  
 }
  }
  else {
    res.status(404).json(JSON.stringify({ message: "League not found" }))
  }

}
