import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import dayjs from 'dayjs';


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {


  const  trade =  JSON.parse(req.body);
  
  console.log(trade); 
  try {
    await prisma.trade.create({
  data: {
    playerIn: trade.player2,
    playerOut: trade.player1,
    participant: {
      connect: {
        id: trade.participantId
      }
    },
    date: dayjs(new Date()).toDate().toISOString(),
  leagueId: trade.leagueId
  }
}).then(async () => {
  await prisma.league.update({
    where: {
      id: trade.leagueId
    },
    data: {
      members: {
        update: {
          where: {
            id: trade.participantId
          },
          data: {
            [trade.tradeRole]: trade.player2
          }
        }
      },
      players: {
        update: [
          {
            where: {
              name_leagueId: {
                name: trade.player1,
                leagueId: trade.leagueId
              }
            },
            data: {
              selected: false,
              selectedBy: null
            }
          },
          {
            where: {
              name_leagueId: {
                name: trade.player2,
                leagueId: trade.leagueId
              }
            },
            data: {
              selected: true,
              selectedBy: trade.fantasyname
            }
          }
        ]
      },
      // delete all playerresults with role = tradeRole and playerid = player1.id
      PlayerResult: {
          
        deleteMany: {
          role:  trade.tradeRole.charAt(0).toUpperCase() + trade.tradeRole.slice(1),
          participantId: trade.participantId,
          name: trade.player1
        }
      }

      
    }
  }).then(async () => {
     
  
      await prisma.$disconnect();
      res.send("success");
   
  })
})
} catch (e) {
  
  res.send("error");
  console.log(e)
}

  


  
}
