import { Teams } from "@prisma/client";
import { League } from "@prisma/client";
import { Players } from "@prisma/client";
import { Participant } from "@prisma/client";
import { Fixture } from "@prisma/client";


export interface Tournament{
 
  league: League;
  teams: Teams[] ;
  players: Players[];
  fixtures: Fixture[];
  

}
