
import io from 'Socket.IO-client'
import dayjs from 'dayjs';
import cargo from '@lib/cargo';

import prisma from '@lib/prisma';
import { Team } from '@customTypes/Team';
import { calculateTeamScore } from './calculate';
import { Participant } from '@customTypes/Participant';

import { Fixture } from '@customTypes/Fixture';
import { Player } from '@customTypes/Player';
import { getPrivateLeaguePlayers,getPrivateLeagueTeams,getPrivateLeagueMatches,getPrivateLeagueResults} from '@lib/cargoQueries';


export class League {
  inviteCode: string;
  name: string;
  owner: string;
  members: Array<Participant> = [];
  draftTime: string;
  startDate:string ;
  endDate: string ;
  inviteOnly: string;
  region: string;
  fixtures: Array<Fixture> = [];
  teams: Array<Team> = [];
  buyIn: boolean;
  buyInFee: number;
  players: Array<Player> = [];
  duration: string;
  minPlayers: number;
  maxPlayers: number;
  houseFee: number;
  constructor(name:string, inviteCode: string, owner: string, draftTime: string, startDate: string, endDate: string, inviteOnly: string, region: string, buyIn: boolean, buyInFee:number, maxPlayers: number, minPlayers: number){
    this.name = name; 
    this.draftTime = draftTime
    this.endDate =  endDate
    this.inviteCode = inviteCode
    this.inviteOnly = inviteOnly
    this.region = region
    this.owner =  owner
    this.startDate = startDate
    this.duration = ''
    this.buyIn = buyIn
    this.buyInFee = buyInFee
    this.minPlayers = minPlayers
    this.maxPlayers = maxPlayers
    this.houseFee = 0
    
    this.members = Array<Participant>()
  }

  removeInvite(participant: Participant) {
    participant.leagues.splice(participant.leagues.findIndex(l => l.name === this.name), 1);
    this.members.splice(this.members.indexOf(participant), 1);
  }

  addMember(participant: Participant) {
    if (this.inviteOnly) {
      const playerinviteCode = participant.leagues.find(
        l => l.inviteCode === this.inviteCode
      )
      if (playerinviteCode) {
        this.members.push(participant);
      }
      else {
        alert('You are not invited to this league');
      }
      
    } else {
         
      if (this.members.find(member => member.username === participant.username)) {
        alert('User is already in league');
      } else if (this.members.length >= this.maxPlayers) {
        alert('League is full');
      } else {
        this.members.push(participant);
      }
    }

 
  }

  addPlayersToLeague(players: Player[]) {
 for (const player of players) {
   this.players.push(player)
 }
    
  }

  
  



  



  

  queryLeaguePlayers() { 
  return this.players
  }

    
  calculateLeagueDuration() { 

    
      const startDate = dayjs(this.startDate);
      const endDate = dayjs(this.endDate);
    const duration = endDate.diff(startDate, 'day');
    
    this.duration = duration.toString();
    return this.duration;
    
  }

  


  

  


}

// export class Leagues {
//   private leagues: Array<League>;
//   constructor() {
//     this.leagues = [];


    
//   }


//   addLeague(league: League) {
//     if (
//       this.leagues.find(
//         l => l.name === league.name
//       )
//     ) {
//       alert('League name already in use');
      
//     }
//     this.leagues.push(league);
    
//     return league;

//   }
  
//   getallLeagues() {
//     return this.leagues;
//   }
//   getNumberOfLeagues() {
//     return this.leagues.length;
//   }
//   getLeagueByName(name: string) {
//     return this.leagues.find(league => league.name === name);
//   }


//   getLeagueByOwner(owner: string) {
//     const theowner = this.leagues.find(league => league.owner === owner);
//     return theowner;
//   }
//   getLeagueByInviteCode(inviteCode: string) {
//     return this.leagues.find(league => league.inviteCode === inviteCode);
//   }
//   getLeagueByRegion(region: string) {
//     return this.leagues.find(league => league.region === region);
//   }
//   getLeagueByInviteOnly(inviteOnly: string) {
//     return this.leagues.find(league => league.inviteOnly === inviteOnly);
//   }


//    createLeague(name:string, inviteCode: string, owner: string, draftTime: string, startDate: string, endDate: string, inviteOnly: string, region: string, buyIn: boolean, buyInFee:number,maxPlayers: number, minPlayers: number) {
    

//     const newLeague = new League(name, inviteCode, owner, draftTime, startDate, endDate, inviteOnly, region, buyIn, buyInFee, maxPlayers, minPlayers);
   
//    this.addLeague(newLeague);
// return newLeague;



//   }

 
    
  







    
//   }


  

