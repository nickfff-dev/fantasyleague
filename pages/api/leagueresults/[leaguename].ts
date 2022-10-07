import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import { Fixture, Teams, League, Players, Participant, TeamResult, PlayerResult} from "@prisma/client"
import { calculatePlayerScore, calculateTeamScore } from "@lib/calculate";


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {



  const leaguename = req.query.leaguename as string;
  

  const league = await prisma.league.findUnique({
    where: {
      name: leaguename
    }
  }).then(async (data) => {
    await prisma.$disconnect();
    return data;

  })


  const fixtures = await prisma.fixture.findMany({
    where: {
      leagueId: league?.id
    }
  }).then(async (data) => {
    await prisma.$disconnect();
    return data;
  });


  
 
    const playerdataz = await prisma.playerResult.groupBy({
      by: ["participantId"],
      where: {
        leagueId: league?.id
      },
      _sum: {
        kills: true,
        assists: true,
        deaths: true,
        creepScore: true,
        visionScore: true,
        teamTotalKills: true,
        points: true,
    
      },
  

    })

    const teamdata = await prisma.teamResult.groupBy({
      by: ["participantId"],
      where: {
        leagueId: league?.id
      },
      _sum: {
        dragonKills: true,
        riftHeraldKills: true,
        baronKills: true,
        turretKills: true,
        inhibitorKills: true,
        teamKills: true,
        points: true
      }
    })


  if (playerdataz.length >0  || teamdata.length>0) {
    const totalTeamPoints = (teamdata: any, playerdata: any) => {
  
      const teampoints = teamdata.reduce((acc: number, team: any) => {
        return acc + team._sum.points;
  
      }, 0)
  
      const playerpoints = playerdata.reduce((acc: number, player: any) => {
        return acc + player._sum.points;
      }, 0)


      const totalpoints = teampoints + playerpoints;
      return totalpoints;
    }



    const findPlayerTotalPoints = async (participantId: number, teamdata: any) => {



      const player = playerdataz.find((player: any) => player.participantId === participantId);
      const team = teamdata.find((team: any) => team.participantId === participantId);
      const totalpoints = player?._sum.points + team?._sum.points
      try {
        await prisma.league.update({
          where: {
            id: league?.id
          },
          data: {
            members: {
              update: {
                where: {
                  id: participantId
                },
                data: {
                  points: totalpoints
                }
              }
            }
          }
        })
      }
  
      catch (error: any) {
        console.log(error)
      }


    }

    await prisma.participant.findMany({
      where: {
        leagueId: league?.id
      }
    }).then((data) => {
      data.forEach(async (participant) => {
        await findPlayerTotalPoints(participant.id, teamdata);
      })
    }).catch((err) => {
      console.log(err);

    })


    try {
      await prisma.league.update({
        where: {
          id: league?.id
        },
        data: {
          points: totalTeamPoints(teamdata, playerdataz),
    
    
        }
      }).then(async () => {
        await prisma.$disconnect();
        res.status(200).json(JSON.stringify({ playerdataz, teamdata }));
      })
    } catch (error) {
      res.status(200).json("not played yet")
    }
  
  

       
 



  
   

  

  

  








  }
  else { 
    res.status(200).json("not played yet")
  }
}
 

