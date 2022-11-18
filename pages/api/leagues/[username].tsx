import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';




export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 
  const username  = req.query.username as string;
try{ await prisma.league.findMany({
  where: {
    members: {
      some: {
        username: username,
      },
    },
 
  },
  include: {
      
    members : true,
  }
}).then((data) => res.send(JSON.stringify(data)))
} catch (e) {
  res.send(JSON.stringify("error"));
 }



}
  
