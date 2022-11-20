import type { NextApiRequest, NextApiResponse } from 'next';
import { getLeagueRosterChanges } from '@lib/cargoQueries';
import { Item } from 'poro/dist/esm/src/leaguepedia/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const data = JSON.parse(req.body);
  const leagueId = data.leagueId;
  const top = data.top;
  const mid = data.mid;
  const bot = data.bot;
  const sup = data.support
  const jungle = data.jungle;
  const startDate = data.startDate;
  const endDate = data.endDate;
  var acceptedChanges: Item<"RosterChanges.Player" | "RosterChanges.Role" | "RosterChanges.Date_Sort" | "RosterChanges.Direction">[] = [];

  await getLeagueRosterChanges(startDate, endDate).then((data) => {
    if (data) {
      data.map((change) => { 
        if(change.Player === top || change.Player === mid || change.Player === bot || change.Player === sup || change.Player === jungle) {
          acceptedChanges.push(change)
        }
      })
   }
 })
  
 res.status(200).json(JSON.stringify({acceptedChanges}));

 }
