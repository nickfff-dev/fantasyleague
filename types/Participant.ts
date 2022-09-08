import { League } from '@customTypes/League';
import { Team } from '@customTypes/Team';
import { Player } from '@customTypes/Player';
export interface Participant
{

  username: string,
  leagues: Array<League>,
  teams: Array<Team>,
  players: Array<Player>,

  }
  

