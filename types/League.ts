import { Teams} from '@prisma/client';
import { Players } from '@prisma/client';
import { Participant } from '@customTypes/Participant';

export interface League{
  name: string,
  region: string,
  owner: string,
  inviteOnly: string,
  inviteCode: string,
  buyIn: boolean,
  buyInFee: number,
  draftTime: string,
  startDate: string,
  endDate: string,
  duration: string,
 players: Array<Players>,
  teams: Array<Teams>,
  minPlayers: number,
  maxPlayers: number,
  houseFee: number,
  members: Array<Participant>,
  
}
