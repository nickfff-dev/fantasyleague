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

  // getPrivateLeagueResults(league).then(
  //   (teams) => {
  //     console.log(teams)
  //   }
  // )
  // populateTeams().then((teams) => {
  //   console.log(teams)
  // })
  // getCurrentGames().then((data) => { 
  //   console.log(data)
  // })
  // populatePlayers().then((players) => { 
  //   console.log(players)
  // })
  

  // getLeagueFixture(league.startDate, league.endDate, league.region).then((data) => {


    
  //   console.log(data)
  // })


  // getPrivateLeagueTeams(league).then((data) => {
  //   if(!data) return;
  //   for(let i = 0; i < data.length; i++){
  // console.log(data[i])}})
  



  return (
    <Grid>
      <Insights />
      <Leagues />
    </Grid>
  );
};

export default HomePage;
