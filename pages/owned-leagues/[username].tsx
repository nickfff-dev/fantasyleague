import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, getSession, signOut } from 'next-auth/react';

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'


const MyLeagues = ({ leagues , username} :  InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [myleagues, setMyLeagues] = useState<League[]>([])


  
  const { data: session } = useSession();
  const user  = session?.user?.name
  return (
    <Grid>
      <div className={s.container} style={{ color: "#ffd204" }}>
        <h1>{ username}</h1>
      <h1>My Leagues</h1>
       
        

    </div>
</Grid>
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
   const username = context.params?.username
   
   const leagues = await prisma.league.findMany({
    where: {
      owner: username as string
     },
     include: {
      members: true
     }
   }).then(async (leagues) => {
    await prisma.$disconnect()
    return leagues
   
   })
  
   console.log(leagues)
   
   return {
     props: {
       leagues,
        username
     }
   }

}













export default MyLeagues

