import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import Stats from "@components/Stats/Stats";
import { InferGetServerSidePropsType } from 'next'

const StatsPage = ({statistics}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (<div>
  
  <Stats statistics={statistics}/>
  
  </div>)
}




export const getServerSideProps: GetServerSideProps = async (context) => {
  const statistics = await prisma.league.findMany({
    include: {
      PlayerResult: true,
      TeamResult: true
   }
  })
  return {
    props: {
      statistics
    }
  }
 }

export default StatsPage
