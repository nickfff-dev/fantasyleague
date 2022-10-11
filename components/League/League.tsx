// Components
import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, Wallet, Deposit, User } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import x from '@components/ui/Button/Button.module.css';
import { useRouter } from 'next/router';


const Leagueview = ({ league }: { league: any  }) => {


  return (
    
    <div style={{color:"white"}}>
      <Grid>
        <div className={s.container} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between",width: "800px" }}>
          <a target="_blank" href={`/league-summary/${league.name}/`}>
            <p > name: {league.name}</p></a>
  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between" }}>        <p>region: {league.region}</p>
          <p>buyInFee: ${league.buyInFee}</p>
          <p>InviteOnly: { league.inviteOnly}</p>
</div>
          
          <div className={s.container} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" , width: "500px"}}>
            {
              league.members.map((participant: Participant) => { 
                return (
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} key={participant.id}>
                    <a target="_blank" href={`/participant/${league.name}/${participant.fantasyname}/Overview/`}><p>{participant.fantasyname}</p></a>
                    <p>{Math.ceil(participant.points as number)}</p>
                  </div>
                )
              })
            }

          </div>

          <p>totalpoints: {Math.ceil(league.points)}</p>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <p> link to league: <a target="_blank" href={`/league-summary/${league.name}`}>{league.name}</a></p>
          <p>join link: <a target="_blank" href={`/optin-league/${league.name}`}>click to join</a></p>
          </div>


        </div>
        
        </Grid>
      </div>
      
  )
 }


export default Leagueview;
