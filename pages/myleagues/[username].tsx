import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetStaticPaths } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react';

      


const MyLeagues = ({ leagues , username}: { leagues: League[] , username: String}) => {

  const [myleagues, setMyLeagues] = useState<League[]>([])


  
  const { data: session } = useSession();
  const user  = session?.user?.name
  return (
    <Grid>
      <div className={s.container} style={{ color: "#ffd204" }}>
        <h1>{ username}</h1>
      <h1>My Leagues</h1>
        {leagues.map((league) => {
          return (
            <div key={league.id}>
              <h2>name: {league.name}</h2>
              <p>region: {league.region}</p>
              <p>owner: {league.owner}</p>
              <p>duration: {league.duration} days</p>
              <a href={`/leagues/${league.name}` }> link to league</a>

            </div>
       )
     })}

    </div>
</Grid>
  )
 }












export const getStaticProps = async ({ params }: { params: any }) => { 



   const username = params.username

  const leagues = await prisma.league.findMany({
    where: {
      members: {
        some: {
          username: params.username
        }
    }
  }
})




  return {
    props: {
      leagues,  username
    },
  }
}



export const getStaticPaths = async () => { 
  const participants = await prisma.participant.findMany({})
  if(!participants) { return }

  const paths = participants.map((participant) => ({
    params: { username: participant.username },
  })
  )
    return {
      paths, fallback: false
    }
}













export default MyLeagues

