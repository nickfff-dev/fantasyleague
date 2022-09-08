import type { NextApiRequest, NextApiResponse } from 'next';
import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"

import {League} from "@lib/league"
import prisma from '@lib/prisma';
import cargo from '@lib/cargo';
import{calculateLeagueDuration} from "@lib/calculate"
import dayjs from 'dayjs';

import { getCurrentGames, getCurrentTeams, getPrivateLeagueTeams, getPrivateLeagueMatches, getPrivateLeaguePlayers,getPrivateLeagueResults,getLeagueFixture } from '@lib/cargoQueries';





export default async function handler(req: NextApiRequest, res: NextApiResponse<League | Mchezo | string>) { 
 
    
 
  const partdata = JSON.parse(req.body)
  

  try {
    const league = await prisma.league.findUnique({
      where: {
        id: partdata.leagueId,
      }
    })


    if (league) {
      const allmembers =  await prisma.participant.findMany({
        where: {leagueId: league.id},
      })
      const confrmdusers = allmembers.filter((member) => {
        return member.draftOrder !== null
       })
       
       if (confrmdusers.length > 0) { 
   
         await prisma.league.update({
           where: {
             id: league.id,
   
           },
           data: {
             members: {
               update: {
                 where: {
                   id:  partdata.draftmanid,
                 },
                 data: {
                   draftOrder: confrmdusers.length + 1,
                 }
               }
   
             }
           }
         })
         res.send (`${partdata.draftmanfantasyname} the draftPosition is ${confrmdusers.length + 1}`)
       } else {
          await prisma.league.update({
            where: {
              id: league.id,
    
            },
            data: {
              members: {
                update: {
                  where: {
                    id:  partdata.draftmanid,
                  },
                  data: {
                    draftOrder: 1,
                  }
                }
    
              }
            }
          })
          res.send (`${partdata.draftmanfantasyname} the draftPosition is 1`)
       }
   }
    
    
    

    


     
    
  }catch(error: any){
    console.log(error)
  }


      
    
    

    
  
  
}
