import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css"
import { GetServerSideProps } from 'next'
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next'




const ConfirmDraft = ({  draftman } : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const [message, setMessage] = useState(""); 
 
  const sendDraft = async () => { 
  
    await fetch(`/api/confirmdraft/${draftman.fantasyname}`, {
      method: "GET",
    }).then((res) => res.text().then((text) => {
      setMessage(text + " " + "the link to draft page" + " " + `http://localhost:3000/draft/${draftman.leaguename}/${draftman.fantasyname}`)
      window.location.href = `/draft/${draftman.leaguename}/${draftman.fantasyname}`
    }))

  }


  return (
    <div className={s.container} style={{color: "white"}}>
      {
        draftman.confirmedAttendance ? (<p>you have already confirmed attendance the link to the draft page is <a target ="_blank" href={`/draft/${draftman.leaguename}/${draftman.fantasyname}`}>link to draft</a> </p>) :(<>   <h1>Confirm Draft</h1> 
        <br/>
        <p>participating in: { draftman.leaguename }</p>  <br/>
          
        <p>
          fantasyteam name: {draftman.fantasyname}
        </p> <br/>
  
     
          {
            message ? (<p>{message}</p>) : null
          }
                <button onClick={sendDraft}> click to Confirm Draft</button>
  </>)
     }

     
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => { 

  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  const fantasyname = context.params?.fantasyname;

  const draftman = await prisma.participant.findUnique({
    where: {
      fantasyname: fantasyname?.toString()
    }
  }).then(async (participant) => {
    await prisma.$disconnect()
    return participant
   
  })
  return {
    props: { draftman }
  }
}



export default ConfirmDraft
