
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { calculateLeagueDuration } from "@lib/calculate";
import { useSession, signIn, signOut } from 'next-auth/react';
import { getCurrentGames, getCurrentTeams, getPrivateLeagueTeams, getPrivateLeagueMatches, getPrivateLeaguePlayers,getPrivateLeagueResults,getLeagueFixture } from '@lib/cargoQueries';

import { Grid } from '@components/ui';



const CreateaLeague = () => { 
    
  const { data: session } = useSession();



  const[leaguelink, setLeagueLink] = useState("")
 
  const [league, setLeague] = useState<Mchezo>();

  const [newLeaguedata, setNewLeaguedata] = useState({
    name: "",
    region: "",
    owner:"",
    inviteOnly: "false",
    inviteCode: "",
    draftTime: "",
    startDate: "",
    endDate: "",
    buyIn: "false",
    buyInFee: 0,
    duration: 0,
    houseFee: 0,
    minPlayers: 0,
    maxPlayers: 0,
   
  

  })



 









  const submitLeague = async () => { 

const body = newLeaguedata

  
    await fetch("/api/makeleague", {
      method: 'POST',
      body: JSON.stringify(body)
    }).then((res) => {
      res.text().then((text) => {
        setLeagueLink(text)
        alert("League Created Successfully")
      })
    }).catch((err: any) => { 
      console.error(err.message);
    })


  }

  return (
    <Grid>
    <div className={s.container} style={{color: "#ffd204"}}>
        <h1>Create a League</h1>
       
       
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}> 
            <label htmlFor="name">League Name  &nbsp;  &nbsp;    <input type="text" placeholder="League Name" name="name" onChange={
              (e) => { 
                setNewLeaguedata({ ...newLeaguedata, name: e.target.value })
                console.log(newLeaguedata)
              }
            } /></label><br/>
            
            <label htmlFor="region">Choose a region:
              <select name="region" onChange={
                (e) => {
                  setNewLeaguedata({ ...newLeaguedata, region: e.target.value })
                 
                  console.log(newLeaguedata)
                 
                }
            } >
  <option value="LEC">LEC EUROPE</option>
  <option value="LCK">LCK KOREA</option>
  <option value="LPL">LPL CHINA</option>
  <option value="LCS">LCS AMERICA</option>
</select>
            
            </label><br/>

            <label htmlFor="owner">Owner  &nbsp;  &nbsp; <input type="text" placeholder="your login username" name="owner" id="owner" value={newLeaguedata.owner}
             
              onChange={
                (e) => { 
                  setNewLeaguedata({ ...newLeaguedata, owner: e.target.value })
                }
             }
            /></label><br/>

            
            <label htmlFor="inviteCode">Invite Code &nbsp;  &nbsp;     <input type="text" placeholder="Invite Code" name="inviteCode" value={newLeaguedata.inviteCode} onChange={
              (e) => {
                setNewLeaguedata({ ...newLeaguedata, inviteCode: e.target.value })
                console.log(newLeaguedata)
              }
            } /></label><br/>
            <label htmlFor="draftTime">Draft Time   &nbsp;  &nbsp;   <input type="datetime-local" placeholder="Draft Time" name="draftTime" onChange={
              (e) => {
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, draftTime: dayjs(theval).toDate().toISOString() })
                console.log(newLeaguedata)
              }
            }/></label><br/>

            <label htmlFor="startDate">Start Date &nbsp;  &nbsp;     <input type="datetime-local" placeholder="Start Date" name="startDate" onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, startDate: dayjs(theval).toDate().toISOString() })
                console.log(newLeaguedata)
              }
            }/></label><br/>
            <label htmlFor="endDate">End Date  &nbsp;  &nbsp;    <input type="datetime-local" placeholder="End Date" name="endDate" onChange={(e) => {
              const theval = e.target.value
              setNewLeaguedata({ ...newLeaguedata, endDate: dayjs(theval).toDate().toISOString() })
              console.log(newLeaguedata)
            }}/></label><br/>
            <label htmlFor="buyIn">Buy In  &nbsp;  &nbsp;         <input type="checkbox" placeholder="Buy In" name="buyIn" checked={false} onChange={
              (e) => {
                const theval  =   e.target.checked? "true" : "false"
                setNewLeaguedata({ ...newLeaguedata, buyIn: theval })
                console.log(newLeaguedata)
               }
            } /></label><br/>
            <label htmlFor="buyInFee">Buy In Fee  &nbsp;  &nbsp;    <input type="number" placeholder="Buy In Fee" name="buyInFee" onChange={
              (e) => {
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, buyInFee: Number(theval) })
                console.log(newLeaguedata)
               }
            } /></label><br />
            
            <label htmlFor="inviteOnly">inviteOnly  true &nbsp;  &nbsp;  <input type="checkbox" placeholder="inviteOnly true?"  name="inviteOnly" checked={false} onChange={
              (e) => { 
                const theval  =   e.target.checked? "true" : "false"
                setNewLeaguedata({ ...newLeaguedata, inviteOnly: theval })
                console.log(newLeaguedata)
              }
            }/></label>
            
            <label htmlFor="minPlayers">minPlayers  &nbsp;  &nbsp;    <input type="number" placeholder="minPlayers" name="minPlayers"  onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, minPlayers: Number(theval) })
                console.log(newLeaguedata)

              }
            }/></label><br/>
            <label htmlFor="maxPlayers">maxPlayers   &nbsp;  &nbsp;   <input type="number" placeholder="maxPlayers" name="maxPlayers"  onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, maxPlayers: Number(theval) })
                console.log(newLeaguedata)
              }
            } /></label><br/>
            <label htmlFor="houseFee">houseFee  &nbsp;  &nbsp;    <input type="number" placeholder="houseFee" name="houseFee"  onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, houseFee: Number(theval) })
                console.log(newLeaguedata)
              }
            } /></label><br/>
            <button type="submit"  onClick={submitLeague} >submit</button>
            </div>
         

      </div>

      <div className={s.container}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {
            leaguelink !="" ?  <a href={`/leagues/${leaguelink}`}>click link to your new league </a> : null
       }
        </div>
      </div>
      </Grid>
)
  
}


export default CreateaLeague



