import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';



export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 


  const data = JSON.parse(req.body)
  if (data.task === "save username") {
    console.log (data.task)
   await prisma.user.update({
      where: { email: data.email },
      data: { userName: data.userName },
   }).then(() => {
    res.status(200).json("success");
   })
    
      
   
  
    
  }

}
