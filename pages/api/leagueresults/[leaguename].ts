import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import { Fixture, Teams, League, Players, Participant, TeamResult} from "@prisma/client"
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



  const allplayerresults = await prisma.playerResult.findMany({
    where: {
      leagueId: league?.id
    }
  }).then(async (data) => {
    await prisma.$disconnect();
    return data;
  })

  // reduce the team results to one object per team
   const playerresults  = allplayerresults.reduce(
    (acc: number, result: any) => acc + Number(calculatePlayerScore(
      result.kills, result.assists, result.deaths, result.teamTotalKills, result.creepScore, result.visionScore
    )), 0
  )


  const allteamresults = await prisma.teamResult.findMany({
    where: {
      leagueId: league?.id
    }
  }).then(async (data) => { 
    await prisma.$disconnect();
    return data;
  })


  const teamresults = allteamresults.reduce((acc: number, result: any) => {

    return acc + calculateTeamScore(
      result.dragonKills, result.baronKills, result.riftHeraldKills, result.inhibitorKills, result.teamKills, result.turretKills, result.didWin
    )


  }, 0)
  

  console.log(playerresults, teamresults)


  res.status(200).json("ok");








}
 

