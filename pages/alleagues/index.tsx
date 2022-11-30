import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'



const AllOpenLeagues = ({ leagues }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
 
  return (
    <Grid>
          <div className={s.root} style={{color: "#ffd204"}}>
      <h1>Open Leagues</h1>
      
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
  const leagues = await prisma.league.findMany({

    include: {
      members: true,
    }
  }).then(async (leagues) => {
    await prisma.$disconnect()
    return leagues
   
  })
  return {
    props: { leagues }
  }
}















export default AllOpenLeagues

