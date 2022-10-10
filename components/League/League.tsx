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
        <div className={s.container} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between",width: "500px" }}>
         <a target="_blank" href={ `/league-summary/${league.name}/`}> <p > name: {league.name}</p></a>
          <p>region: {league.region}</p>

          
          <div className={s.container} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" , width: "500px"}}>
            {
              league.members.map((participant: Participant) => { 
                return (
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} key={participant.id}>
                    <a target="_blank" href={`/participant/${league.name}/${participant.fantasyname}/Overview/`}><p>{participant.fantasyname}</p></a>
                    <p>{participant.points}</p>
                  </div>
                )
              })
            }

          </div>
          <p>totalpoints: {league.points}</p>


        </div>
        
        </Grid>
      </div>
      
  )
 }


export default Leagueview;
