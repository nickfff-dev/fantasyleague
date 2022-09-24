import type { NextApiRequest, NextApiResponse } from 'next';
import { League as Mchezo, Fixture, Teams, Players,Participant } from "@prisma/client"


import prisma from '@lib/prisma';
import cargo from '@lib/cargo';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {


  if (req.method === "POST") {
    const data = JSON.parse(req.body)

    const leaguename = data.leaguename
    const username = data.username
    const teamname = data.teamname

    try {
      await prisma.league.update({
        where: {
          name: leaguename
        },
        data: {
          members: {
            create: {
              username: username,
              fantasyname: teamname,
              leaguename: leaguename

            }
          }
        }
      })

      res.status(200).send(`Joined ${leaguename} successfully as ${teamname}`)
    }catch(e){
      console.log(e)
    }
  }
  
}
