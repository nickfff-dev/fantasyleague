// Components
import { Grid } from '@components/ui';
import Insights from './Insights/Insights';
import Leagues from './Leagues/Leagues';
import { getPrivateLeaguePlayers,getLeagueFixture,getPrivateLeagueTeams,getPrivateLeagueMatches,getPrivateLeagueResults,getCurrentGames } from '@lib/cargoQueries';
import { populateTeams, populatePlayers } from "@lib/populateTeams"
import dayjs from 'dayjs';
import { Player } from '@customTypes/Player';
import { Fixture } from '@customTypes/Fixture';


const HomePage = () => {

  const league = {
    name: 'Private League',
    region: "LCS",
    owner: "ME",
    inviteOnly: "true",
    inviteCode: "string",
   
    draftTime: dayjs().add(1, 'day').toDate().toISOString(),
    startDate: dayjs().add(-30, 'day').toDate().toISOString(),
    endDate: dayjs().add(-10, 'day').toDate().toISOString(),
    players: Array<Player>(),
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


  



  return (
    <Grid>
      <Insights />
      <Leagues />
    </Grid>
  );
};

export default HomePage;
