import type { NextApiRequest, NextApiResponse } from 'next';
import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"

import {League} from "@lib/league"
import prisma from '@lib/prisma';
import cargo from '@lib/cargo';
import{calculateLeagueDuration} from "@lib/calculate"
import dayjs from 'dayjs';

import { getCurrentGames, getCurrentTeams, getPrivateLeagueTeams, getPrivateLeagueMatches, getPrivateLeaguePlayers,getPrivateLeagueResults,getLeagueFixture } from '@lib/cargoQueries';





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
        
         
         getPrivateLeaguePlayers(league.startDate, league.endDate, league.region).then((players) => {

           if (players) {
             players.forEach(async (player) => {
               await prisma.league.update({
                 where: { name: league.name },
                 data: {
                   players: {
                     create: {
                       name: player.Player,
                       team: player.Team,
                       position: player.Role,
                       selected: false,
                     }
                   }
                 }
               })
             })
           }
      
         }).then(() => {
           getPrivateLeagueTeams(league.startDate, league.endDate, league.region).then((teams) => {
             if (teams) {
               teams.forEach(async (team) => {
                 await prisma.league.update({
                   where: { name: league.name },
                   data: {
                     teams: {
                       create: {
                         name: team.Team,
                         top: team.RosterLinks.split(";;")[0],
                         jungle: team.RosterLinks.split(";;")[1],
                         mid: team.RosterLinks.split(";;")[2],
                         adc: team.RosterLinks.split(";;")[3],
                         support: team.RosterLinks.split(";;")[4],
                         points: 0,
                         selected: false
                       }
                     }
                   }
                 })
               })
             }
            
           })
           
         }).then(() => { 
          getLeagueFixture(league.startDate, league.endDate, league.region).then((fixtures) => {
            if (fixtures) {
              fixtures.forEach(async (fixture) => {
                await prisma.league.update({
                  where: { name: league.name },
                  data: {
                    fixtures: {
                      create: {
                        MatchId: fixture.MatchId,
                        DateTime_UTC: dayjs(fixture.DateTime_UTC).format("YYYY-MM-DD"),
                        Tab: fixture.Tab,
                        Team1: fixture.Team1,
                        Team2: fixture.Team2,
                       
                      }
                    }
                  }
                })
              })
            }
            
          })    
           
         })
      })
      res.status(200).send(`${league.name}`)
    }
    catch (e: any) {
      console.log(e)
    }
  
  
}
