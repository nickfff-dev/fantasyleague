
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { calculateLeagueDuration } from "@lib/calculate";
import { useSession, signIn, getSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import prisma from '@lib/prisma';
import CreateLeague from "@components/Form/Creatorform";
import { Grid } from '@components/ui';



const CreateaLeague = ({ username, owner }:  InferGetServerSidePropsType<typeof getServerSideProps>) => { 
    
  
  useEffect(() => { 

    if (owner.verificationCode === null || owner.verificationCode === "" || owner.emailVerified=== false) {
      window.location.href = "/user/verify"
    }
  } ,[owner.verificationCode])


  const[leaguelink, setLeagueLink] = useState("")
 
  const [league, setLeague] = useState<Mchezo>();

  const [newLeaguedata, setNewLeaguedata] = useState({
    name: "",
    region: "",
    owner:username,
    inviteOnly: "false",
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
    // check for empty fields
    if (body.name === "" || body.region === "" || body.owner === "" || body.inviteOnly === "" ||  body.draftTime === "" || body.startDate === "" || body.endDate === "" || body.buyIn === "" ||   body.minPlayers === 0 || body.maxPlayers === 0) { 
      alert("All fields are required")
      return
    }
  
    await fetch("/api/create-league", {
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
    <>
    {/* <div className={s.container} style={{color: "#ffd204"}}>
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
        
            <button type="submit"  onClick={submitLeague} >submit</button>
            </div>
         

      </div>

      <div className={s.container}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {
            leaguelink !="" ?  <a href={`/league-summary/${leaguelink}`}>click link to your new league </a> : null
       }
        </div>
        
      </div> */}
      <CreateLeague username={username}/>
      </>
)
  
}
 
export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const username = session?.user?.name?.toString()
  console.log(session?.user?.name?.toString())

  const owner = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
      
    }
  }).then((data) => {
    return data
  })
  return {
    props: { username, owner },
  }
}


 




export default CreateaLeague



