// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Date } from '@customTypes/Date';

import cargo from '@lib/cargo';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Date[] | string>) {
  if (req.method === 'GET') {
    try {
      const { data } = await cargo.query({
        tables: ['Tournaments', 'CurrentLeagues'],
        fields: ['Tournaments.DateStart', 'Tournaments.Name'],
        joinOn: [
          {
            left: 'Tournaments.Name',
            right: 'CurrentLeagues.Event',
          },  
        ],
        where:
          'Tournaments.Name = CurrentLeagues.Event AND (Tournaments.Name LIKE "%LCS%" OR Tournaments.Name LIKE "%LEC%" OR Tournaments.Name LIKE "%LCK%" OR Tournaments.Name LIKE "%LPL%") AND Tournaments.Name NOT LIKE "%LCK CL%" AND Tournaments.Name NOT LIKE "%LCS Proving Grounds%" ',
      });

      if (data.length <= 0) {
       return res.send('No active tournaments found');
        
      }
           console.log("data",data);
      const dates = data?.map((league) => {
        const date = dayjs(league.DateStart).format('MMM. DD') + 'th';
        const name = league.Name.split(' ')[0];
        
        return {
          date,
          name,
        };
      });
       
      return res.status(200).send(dates);
     
    } catch (e: any) {
     return res.status(404).send(`Error getting dates ${e.message}`);
      
    }
  }
}
