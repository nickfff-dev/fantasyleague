import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';



export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {

  const { fantasyname } = req.query;
  const  trade =  JSON.parse(req.body);


  console.log(trade.player1, trade.player2, trade.leaguename); 

  res.send('ok');


  
}
