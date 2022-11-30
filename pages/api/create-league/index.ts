import type { NextApiRequest, NextApiResponse } from 'next';
import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"

import {League} from "@lib/league"
import prisma from '@lib/prisma';
import cargo from '@lib/cargo';
import{calculateLeagueDuration} from "@lib/calculate"
import dayjs from 'dayjs';

import {  getPrivateLeagueTeams,  getPrivateLeaguePlayers,getLeagueFixture, } from '@lib/cargoQueries';





export default async function handler(req: NextApiRequest, res: NextApiResponse<League | Mchezo | string>) { 
 
    
 
    const league = JSON.parse(req.body)
    const duration = calculateLeagueDuration(league.startDate, league.endDate)

      
    
    

    try {
      
       await prisma.league.create({

        data: {
          name: league.name,
          region: league.region,
          owner: league.owner,
          inviteOnly: league.inviteOnly,
          inviteCode: league.inviteCode,
          draftTime: league.draftTime,
          startDate: league.startDate,
          endDate: league.endDate,
          buyIn: league.buyIn,
          buyInFee: league.buyInFee,
          duration: duration,
          maxPlayers: league.maxPlayers, 
          minPlayers: league.minPlayers,
        }
 
       }).then(() => {
        
         
     
          getPrivateLeaguePlayers(league.name, league.startDate, league.endDate, league.region)
          getPrivateLeagueTeams(league.name, league.startDate, league.endDate, league.region)
         getLeagueFixture(league.name, league.startDate, league.endDate, league.region)
      
 
      })
      res.status(200).send(`${league.name}`)
    }
    catch (e: any) {
      console.log(e)
    }
  
  
}
