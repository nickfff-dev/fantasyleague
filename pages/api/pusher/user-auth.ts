import type { NextApiRequest, NextApiResponse } from 'next'
import Pusher from  "pusher"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const body = JSON.parse(req.body)


  const socketId = body.socketId;
  const userId = body.userId;
  const leagueId = body.leagueId;
  const fantasyname = body.fantasyname;
  const channel = body.channel;
 console.log(socketId, userId, leagueId, fantasyname, channel)
  const pushers = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_APP_CLUSTER as string,
  })


  var presenceData = {
    user_id: userId,
    user_info: {
      fantasyname: fantasyname,
      leagueId: leagueId
    }

  }

  var auth = pushers.authorizeChannel(socketId, channel, presenceData);

  res.send(auth);

  

  





}
