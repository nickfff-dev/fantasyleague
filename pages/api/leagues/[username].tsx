import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';




export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 



  
    try {
      await prisma.league.findMany({
  
        include: {
      
          members: true,
          fixtures: true
        }
      }).then((data) => res.send(JSON.stringify(data)))
    } catch (e) {
      res.send(JSON.stringify("error"));
    }
 
  



}
  
