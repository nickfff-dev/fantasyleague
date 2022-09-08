import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';







const JoinLeague = ({ league }: { league: League }) => {

  const [teamName , setTeamName] = useState("");
  const { data: session } = useSession();
  const [responsetext, setResponseText] = useState("")

  const enrollToleague = async () => {
    let leaguename = league.name
    let username = session?.user?.name?.toString()
    let teamname = teamName
    
    try {
      await fetch(`/api/joinaleague`, {
        method: 'POST',
        body: JSON.stringify({
          leaguename,
          username,
          teamname
        })
      }).then((res) => {
        res.text().then((text) => {
          setResponseText(text)
        
       })
  
      })

    } catch (err: any) { 
      console.error(err.message);
    }
  
  }




  return (
    <div className={s.container}>
      
      

      <label htmlFor="leaguename" >League Name
        <input defaultValue={league.name} /> </label>
      <label htmlFor="username" >yourusername
        <input defaultValue={session?.user?.name?.toString()} /> 
      </label>

      <label htmlFor="teamname" >Team Name 
        <input name ="teamname"value={teamName} onChange={
          (e) => { 
            setTeamName(e.target.value)
          }
        } />
      </label>
      <button onClick={enrollToleague}>click to enroll</button>
      <h1 style={{color: "white"}}>{
      responsetext? responsetext : "Join a League"
    }</h1>
    </div>
 
  )
}

















export const getStaticProps = async ({ params }: { params: any }) => { 


  const league = await prisma.league.findUnique({
    where: {name: params.name},
  })


 

  return {
    props: {
      league
     
    },
  }
}

export const getStaticPaths = async () => {
  const leagues = await prisma.league.findMany()
  const paths = leagues.map((league) => ({
    params: { name: league.name },
  }))

  return { paths, fallback: false }
  
  
}






export default JoinLeague
