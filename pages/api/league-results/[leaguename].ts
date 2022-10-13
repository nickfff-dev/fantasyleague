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
    

    const partcipantpo = await prisma.participant.groupBy({
      by: ["leagueId"],
      where: {
        leagueId: league?.id
      },
      _sum: {
        points: true
      }
    }).then(async (data) => {
      await prisma.$disconnect();
      return data;
  
    })
    





    try {
      await prisma.league.update({
        where: {
          id: league?.id
        },
        data: {
          points: partcipantpo[0]._sum.points,
    
    
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
 

