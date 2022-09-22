import { getCurrentGames, getCurrentTeams, getPrivateLeagueTeams, getPrivateLeagueMatches, getPrivateLeaguePlayers,getPrivateLeagueResults } from '@lib/cargoQueries';
import { Players } from '@prisma/client';
import dayjs from 'dayjs';
import { Fixture } from '@customTypes/Fixture';
import {PlayerResults} from '@customTypes/PlayerResults'

import prisma from '@lib/prisma';

// Types
import { Team } from '@customTypes/Team';
import { calculateTeamScore } from './calculate';
import { calculatePlayerScore } from './calculate';
import { TeamResults } from '@customTypes/teamresults';
const league = {
  name: 'Private League',
  region: "LCS",
  owner: "ME",
  inviteOnly: "true",
  inviteCode: "string",
 
  draftTime: dayjs().add(1, 'day').toDate().toISOString(),
  startDate: dayjs().add(-10, 'day').toDate().toISOString(),
  endDate: dayjs().add(18, 'day').toDate().toISOString(),
  players: Array<Players>(),
  teams: [],
  buyIn: false,
  members: [],
  buyInFee: 0,
  duration: "0",
  fixtures: Array<Fixture>(),
  houseFee: 0,
  
  minPlayers: 3,
  maxPlayers: 10,

}
// will be used inside the admin panel to fetch/repopulate teams data
export const populateTeams = async () => {

  const teamperfomance: Array<TeamResults> = []


  try {
    const data = await getPrivateLeagueTeams(league.startDate, league.endDate, league.region);
    const games = await getPrivateLeagueMatches(league.startDate, league.endDate, league.region);

    if (!data) {
      return 'No Teams Currently Competing';
    }

    const teams = data.map((team) => {
      const roster = team.RosterLinks.split(';;');
      const currentTeamGames = games?.filter((game) => game.Team1 === team.Team || game.Team2 === team.Team);

      const scoreArray = currentTeamGames?.map((currentTeamGame) => {
        if (team.Team === currentTeamGame.Team1) {
          teamperfomance.push({
            name: team.Team,
            slug: currentTeamGame.MatchId,
            game:currentTeamGame.GameId,
            top: roster[0],
            jungle: roster[1],
            mid: roster[2],
            adc: roster[3],
            support: roster[4],
            teamKills: currentTeamGame.Team1Kills,
            dragonKills: currentTeamGame.Team1Dragons,
            baronKills: currentTeamGame.Team1Barons,
            riftHeraldKills: currentTeamGame.Team1RiftHeralds,
            inhibitorKills: currentTeamGame.Team1Inhibitors,
            didWin: currentTeamGame.Winner === 1 ? true : false,
            turretKills: currentTeamGame.Team1Towers,
            points: calculateTeamScore(currentTeamGame.Team1Kills, currentTeamGame.Team1Dragons, currentTeamGame.Team1Barons, currentTeamGame.Team1RiftHeralds, currentTeamGame.Team1Inhibitors, currentTeamGame.Team1Towers, currentTeamGame.Winner === 1 ? true : false),
          })
        } else if (team.Team === currentTeamGame.Team2) {
          teamperfomance.push({
            name: team.Team,
            slug: currentTeamGame.MatchId,
            game: currentTeamGame.GameId,
            top: roster[0],
            jungle: roster[1],
            mid: roster[2],
            adc: roster[3],
            support: roster[4],
            teamKills: currentTeamGame.Team2Kills,
            dragonKills: currentTeamGame.Team2Dragons,
            baronKills: currentTeamGame.Team2Barons,
            riftHeraldKills: currentTeamGame.Team2RiftHeralds,
            inhibitorKills: currentTeamGame.Team2Inhibitors,
            didWin: currentTeamGame.Winner === 2 ? true : false,
            turretKills: currentTeamGame.Team2Towers,
            points: calculateTeamScore(currentTeamGame.Team2Kills, currentTeamGame.Team2Dragons, currentTeamGame.Team2Barons, currentTeamGame.Team2RiftHeralds, currentTeamGame.Team2Inhibitors, currentTeamGame.Team2Towers, currentTeamGame.Winner === 2 ? true : false),

          })
        } else {
          return 0;
        }
      });

    });

  
 
  return teamperfomance
  } catch (e: any) {
    console.log('ERROR IN getCurrentTeams', e.message);
  }
};


export const populatePlayers = async () => { 

 const playerperformance:Array<PlayerResults> = [];

  try {
    const players = await getPrivateLeaguePlayers(league.startDate, league.endDate, league.region);
    const results = await getPrivateLeagueResults(league.startDate, league.endDate, league.region);
    if (!players) {
      return 'No Players Currently Competing';
    }

    const playersArray = players.map((player) => { 
      const currentPlayerGames = results?.filter((result) => result.Link === player.Player);

      const scoreArray = currentPlayerGames?.map((currentPlayerGame) => {
       
        playerperformance.push({
          name: currentPlayerGame.Link,
          team: currentPlayerGame.Team,
          role: currentPlayerGame.Role,
          creepScore: currentPlayerGame.CS,
          visionScore: currentPlayerGame.VisionScore,
          kills: currentPlayerGame.Kills,
          deaths: currentPlayerGame.Deaths,
          assists: currentPlayerGame.Assists,
          game: currentPlayerGame.GameId,
          teamTotalKills: currentPlayerGame.TeamKills,
          points: calculatePlayerScore(currentPlayerGame.Kills, currentPlayerGame.Deaths, currentPlayerGame.Assists, currentPlayerGame.CS, currentPlayerGame.VisionScore, currentPlayerGame.TeamKills),
          league: league.name,
          date: currentPlayerGame.DateTime_UTC
        })
      })
    })
    return playerperformance;
 }
 catch (e: any) {
    console.log('ERROR IN populating players', e.message);
    
}








}
