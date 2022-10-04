import cargo from '@lib/cargo';
import { group } from 'console';
import dayjs from 'dayjs';
import { Region } from 'poro/dist/esm/src/types';
import { League } from '@customTypes/League';

export const getCurrentTeams = async () => {
  try {
    const { data } = await cargo.query({
      tables: ['Tournaments', 'CurrentLeagues', 'TournamentRosters'],
      fields: [
        'TournamentRosters.Team',
        'TournamentRosters.RosterLinks',
        'TournamentRosters.Roles',
        'TournamentRosters.UniqueLine',
        'TournamentRosters.IsUsed'
      ],
      where:
        'Tournaments.Name = CurrentLeagues.Event AND (Tournaments.Name LIKE "%LCS%" OR Tournaments.Name LIKE "%LEC%" OR Tournaments.Name LIKE "%LCK%" OR Tournaments.Name LIKE "%LPL %") AND Tournaments.Name NOT LIKE "%CL%"',
      joinOn: [
        {
          left: 'Tournaments.Name',
          right: 'CurrentLeagues.Event',
        },
        {
          left: 'Tournaments.OverviewPage',
          right: 'TournamentRosters.OverviewPage',
        },
      ],
      groupBy: ['TournamentRosters.Team'],
    });

    return data;
  } catch (e: any) {
    console.log('ERROR IN getCurrentTeams', e.message);
  }
};

export const getCurrentPlayers = async () => {
  try {
    const { data } = await cargo.query({
      tables: ['Tournaments', 'CurrentLeagues', 'TournamentRosters', 'Players'],
      fields: ['Players.Player', 'Players.Team', 'Players.Role', 'Tournaments.Name', 'CurrentLeagues.Event', 'Tournaments.DateStart', "TournamentRosters.IsComplete"],
      where:
        'Tournaments.Name = CurrentLeagues.Event AND (Tournaments.Name LIKE "%LCS%" OR Tournaments.Name LIKE "%LEC%" OR Tournaments.Name LIKE "%LCK%" OR Tournaments.Name LIKE "%LPL %") AND Tournaments.Name NOT LIKE "%LCK CL%" AND Players.IsRetired = "No" AND Tournaments.Name NOT LIKE "%LCS Proving Grounds%"',
      joinOn: [
        { 
          left: 'Tournaments.Name',
          right: 'CurrentLeagues.Event',
        },
        {
          left: 'Tournaments.OverviewPage',
          right: 'TournamentRosters.OverviewPage',
        },
        {
          left: 'TournamentRosters.Team',
          right: 'Players.Team',
        },
      ],
      
    });

    return data;
  } catch (e: any) {
    console.log('ERROR IN getCurrentPlayers', e.message);
  }
};

export const getCurrentGames = async () => {
  try {
    const { data } = await cargo.query({
      tables: ['Tournaments', 'CurrentLeagues', 'MatchSchedule', 'ScoreboardGames'],
      fields: [
        'Tournaments.Name',
        'MatchSchedule.BestOf',
        'MatchSchedule.MatchId',
        'ScoreboardGames.GameId',
        'ScoreboardGames.Gamename',
        'ScoreboardGames.Gamelength',
        'ScoreboardGames.DateTime_UTC',
        'ScoreboardGames.Team1',
        'ScoreboardGames.Team2',
        'ScoreboardGames.Winner',
        'ScoreboardGames.Team1Dragons',
        'ScoreboardGames.Team2Dragons',
        'ScoreboardGames.Team1Barons',
        'ScoreboardGames.Team2Barons',
        'ScoreboardGames.Team1RiftHeralds',
        'ScoreboardGames.Team2RiftHeralds',
        'ScoreboardGames.Team1Towers',
        'ScoreboardGames.Team2Towers',
        'ScoreboardGames.Team1Inhibitors',
        'ScoreboardGames.Team2Inhibitors',
        'ScoreboardGames.Team1Kills',
        'ScoreboardGames.Team2Kills',
      ],
      where:
        'Tournaments.Name = CurrentLeagues.Event AND (Tournaments.Name LIKE "%LCS%" OR Tournaments.Name LIKE "%LEC%" OR Tournaments.Name LIKE "%LCK%" OR Tournaments.Name LIKE "%LPL%") AND (Tournaments.Name NOT LIKE "%LCK CL%" OR  Tournaments.Name NOT LIKE "%LCS Proving Grounds%") AND MatchSchedule.Winner IS NOT NULL',
      joinOn: [
        {
          left: 'Tournaments.Name',
          right: 'CurrentLeagues.Event',
        },
        {
          left: 'Tournaments.OverviewPage',
          right: 'MatchSchedule.OverviewPage',
        },
        {
          left: 'MatchSchedule.MatchId',
          right: 'ScoreboardGames.MatchId',
        },
      ],
      groupBy: ['ScoreboardGames.DateTime_UTC'],
      orderBy: [{ field: 'ScoreboardGames.DateTime_UTC', desc: true }],
      limit: 5000
    });
    
    return data;
  } catch (e: any) {
    console.log('ERROR IN getCurrentGames', e.message);
  }
};







export const getLeagueFixture = async (startDate: string, endDate: string, region: string) => { 

  try {
    const { data } = await cargo.query({
      
      tables: ["MatchSchedule"],
      fields: [
        "MatchSchedule.OverviewPage", 'MatchSchedule.DateTime_UTC', 'MatchSchedule.BestOf', 'MatchSchedule.Team1', 'MatchSchedule.Team2', 'MatchSchedule.Winner',  'MatchSchedule.Tab',  'MatchSchedule.MatchId','MatchSchedule._pageName'
      ],
      where: `MatchSchedule.DateTime_UTC >= "${startDate}" AND MatchSchedule.DateTime_UTC <= "${endDate}" AND MatchSchedule.OverviewPage LIKE "%${region}%" AND MatchSchedule.OverviewPage NOT LIKE "%Academy%" AND MatchSchedule.OverviewPage NOT LIKE "%LCS Proving Grounds%" AND MatchSchedule.OverviewPage NOT LIKE "%LCK CL%" AND MatchSchedule.OverviewPage NOT LIKE "%Championship%" AND MatchSchedule.OverviewPage NOT LIKE "%Regional%" AND MatchSchedule.OverviewPage NOT LIKE "%Playoffs%" `,
     
    })
   
    return data
  }catch (e: any) {
    console.log('ERROR IN getCurrentTeams', e.message);
  }

}









export const getPrivateLeaguePlayers = async (startDate: string, endDate: string, region: string) => { 

  
  try {

    const { data } = await cargo.query({
      tables: ["MatchSchedule", "TournamentRosters", "Players"],
      fields: ["Players.Player", "Players.Role", "Players.Team", "TournamentRosters.Team", "TournamentRosters.OverviewPage", "MatchSchedule.OverviewPage", "Players.IsSubstitute", "Players.TeamLast"],
      where: `MatchSchedule.DateTime_UTC >= "${startDate}" AND MatchSchedule.DateTime_UTC <= "${endDate}" AND MatchSchedule.OverviewPage LIKE "%${region}%" AND MatchSchedule.OverviewPage NOT LIKE "%Academy%" AND MatchSchedule.OverviewPage NOT LIKE "%LCS Proving Grounds%" AND MatchSchedule.OverviewPage NOT LIKE "%LCK CL%" AND MatchSchedule.OverviewPage NOT LIKE "%Championship%" AND MatchSchedule.OverviewPage NOT LIKE "%Regional%" AND MatchSchedule.OverviewPage NOT LIKE "%Playoffs%"`,
      joinOn: [
        {
          left: "TournamentRosters.Team",
          right: "Players.Team",
        },
        {
          left: "TournamentRosters.OverviewPage",
          right: "MatchSchedule.OverviewPage",
        }

      ],
      groupBy: ["Players.Player"],
      

    })
    
    return data
  }
  catch (e: any) { 
    console.log('ERROR IN getPrivateLeaguePlayers', e.message);
  }

}



export const getPrivateLeagueTeams = async (startDate: string, endDate: string, region: string) => { 
  try {

    const { data } = await cargo.query({
      tables: ["MatchSchedule", "TournamentRosters"],
      fields: [
        'TournamentRosters.Team',
        'TournamentRosters.RosterLinks',
        'TournamentRosters.Roles',
        'TournamentRosters.UniqueLine',
        'TournamentRosters.IsUsed'
      ],
      where: `MatchSchedule.DateTime_UTC >= "${startDate}" AND MatchSchedule.DateTime_UTC <= "${endDate}" AND MatchSchedule.OverviewPage LIKE "%${region}%" AND MatchSchedule.OverviewPage NOT LIKE "%Academy%" AND MatchSchedule.OverviewPage NOT LIKE "%LCS Proving Grounds%" AND MatchSchedule.OverviewPage NOT LIKE "%LCK CL%" AND MatchSchedule.OverviewPage NOT LIKE "%Championship%" AND MatchSchedule.OverviewPage NOT LIKE "%Regional%" AND MatchSchedule.OverviewPage NOT LIKE "%Playoffs%"`,
      joinOn: [
        
        {
          left: "TournamentRosters.OverviewPage",
          right: "MatchSchedule.OverviewPage",
        }

      ],
      groupBy: ['TournamentRosters.Team'],
      

    })
    
    return data
  }
  catch (e: any) { 
    console.log('ERROR IN getPrivateLeagueTeams', e.message);
  }


}



export const getPrivateLeagueMatches = async (startDate: string, endDate: string, region: string) => { 
  try {
    const { data } = await cargo.query({
      tables: ['MatchSchedule', 'ScoreboardGames'],
      fields: [
        'MatchSchedule.OverviewPage',
        'MatchSchedule.BestOf',
        'MatchSchedule.MatchId',
        'ScoreboardGames.GameId',
        'ScoreboardGames.Gamename',
        'ScoreboardGames.Gamelength',
        'ScoreboardGames.DateTime_UTC',
        'ScoreboardGames.Team1',
        'ScoreboardGames.Team2',
        'ScoreboardGames.Winner',
        'ScoreboardGames.Team1Dragons',
        'ScoreboardGames.Team2Dragons',
        'ScoreboardGames.Team1Barons',
        'ScoreboardGames.Team2Barons',
        'ScoreboardGames.Team1RiftHeralds',
        'ScoreboardGames.Team2RiftHeralds',
        'ScoreboardGames.Team1Towers',
        'ScoreboardGames.Team2Towers',
        'ScoreboardGames.Team1Inhibitors',
        'ScoreboardGames.Team2Inhibitors',
        'ScoreboardGames.Team1Kills',
        'ScoreboardGames.Team2Kills',
      ],
  
      where: `MatchSchedule.DateTime_UTC >= "${startDate}" AND MatchSchedule.DateTime_UTC <= "${endDate}" AND MatchSchedule.OverviewPage LIKE "%${region}%" AND MatchSchedule.OverviewPage NOT LIKE "%Academy%" AND MatchSchedule.OverviewPage NOT LIKE "%LCS Proving Grounds%" AND MatchSchedule.OverviewPage NOT LIKE "%LCK CL%" AND MatchSchedule.OverviewPage NOT LIKE "%Championship%" AND MatchSchedule.OverviewPage NOT LIKE "%Regional%" AND MatchSchedule.OverviewPage NOT LIKE "%Playoffs%"`,
      joinOn: [
      
        {
          left: 'MatchSchedule.MatchId',
          right: 'ScoreboardGames.MatchId',
        },
      ],
    
      orderBy: [{ field: 'ScoreboardGames.DateTime_UTC', desc: true }],
    });
    
    return data;
  } catch (e: any) {
    console.log('ERROR IN getCurrentmatches', e.message);
  }

}


export const getPrivateLeagueResults = async (startDate: string, endDate: string, region: string) => {
  try {
    const { data } = await cargo.query({
      tables: ['MatchSchedule', 'ScoreboardPlayers'],
      fields: [
        'MatchSchedule.OverviewPage',"MatchSchedule.BestOf", "MatchSchedule.MatchId","ScoreboardPlayers.GameId", "ScoreboardPlayers.Link", "ScoreboardPlayers.Team","ScoreboardPlayers.Assists", "ScoreboardPlayers.Deaths",        "ScoreboardPlayers.Role",         "ScoreboardPlayers.DateTime_UTC",  "ScoreboardPlayers.TeamKills",    "ScoreboardPlayers.Assists",         "ScoreboardPlayers.Kills",         "MatchSchedule.BestOf",         "ScoreboardPlayers.CS",         "ScoreboardPlayers.VisionScore",  "ScoreboardPlayers.OverviewPage",
      ],
      where: `MatchSchedule.DateTime_UTC >= "${startDate}" AND MatchSchedule.DateTime_UTC <= "${endDate}" AND MatchSchedule.OverviewPage LIKE "%${region}%" AND MatchSchedule.OverviewPage NOT LIKE "%Academy%" AND MatchSchedule.OverviewPage NOT LIKE "%LCS Proving Grounds%" AND MatchSchedule.OverviewPage NOT LIKE "%LCK CL%" AND MatchSchedule.OverviewPage NOT LIKE "%Championship%" AND MatchSchedule.OverviewPage NOT LIKE "%Regional%" AND MatchSchedule.OverviewPage NOT LIKE "%Playoffs%"`,
      joinOn: [
        {left: 'MatchSchedule.MatchId', right: 'ScoreboardPlayers.MatchId'},
      ],
      orderBy: [{ field: 'ScoreboardPlayers.DateTime_UTC', desc: true }],
      

    })
    
return data

  }catch (e: any) {
    console.log('ERROR IN getCurrentmatches', e.message);
  }

}
