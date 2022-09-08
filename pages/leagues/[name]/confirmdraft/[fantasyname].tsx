import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";




const ConfirmDraft = ({ league, draftman }: { league: League, draftman: Participant }) => {
  
  const [draftPosition, setDraftPosition] = useState(0); 
  useEffect(() => { 

    if (draftman.draftOrder) {
      setDraftPosition(draftman.draftOrder);
    }
    
  },[])
  const sendDraft = async () => { 
    const body = {
      leagueId: league.id,
      draftmanid: draftman.id,
      draftmanfantasyname: draftman.fantasyname,
    }
    await fetch("/api/confirmdraft", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.text().then((text) => {
      console.log(text)
    }))

  }


  return (
    <div className={s.container} style={{color: "white"}}>
      {
        draftPosition === 0 ? <h1>Confirm Draft</h1> : <h1>Draft confirmed</h1> 
     }
      <br/>
      <p>participating in: {league.name }</p>  <br/>
        
      <p>
        fantasyteam name: {draftman.fantasyname}
      </p> <br/>

   
      {
        draftPosition > 0 ? <p>draft position: {draftPosition} <br/> you have already confirmed </p> :       <button onClick={sendDraft}> click to Confirm Draft</button>
}

     
    </div>
  )
}


export const getStaticProps = async ({ params }: { params: any }) => { 


  const league = await prisma.league.findUnique({
    where: {name: params.name},
  })

  if (!league){return} 
  const draftman = await prisma.participant.findFirst({
    where: {
      fantasyname: params.fantasyname,
    }
  })
 

  return {
    props: {
      league, draftman
     
    },
  }
}

export const getStaticPaths = async () => { 
  const leagues = await prisma.league.findMany()
  const participants = await prisma.participant.findMany()
 

  
const paths = participants.map((participant) => ({
  params: { fantasyname: participant.fantasyname, name: participant.leaguename },
}))


  return { paths, fallback: false }

}



export default ConfirmDraft
