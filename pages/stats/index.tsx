import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import Stats from "@components/Stats/Stats";
import { InferGetServerSidePropsType } from 'next'

const StatsPage = ({players}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (<>
  
  <Stats players={players}/>
  
  </>)
}




export const getServerSideProps: GetServerSideProps = async (context) => {
  const players = await prisma.playerResult.findMany({
 
  })
  return {
    props: {
      players
    }
  }
 }

export default StatsPage
