import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import L from "@components/Leaguesummary/Leaguesummary.module.css";
import TeamTab from "@components/Leaguesummary/TeamTab";
import TradeTab from "@components/Leaguesummary/TradeTab"
import LeagueSummary from "@components/Leaguesummary/League";



const LeaguePage = ({ league, wallets}: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
    
  return (
    <LeagueSummary league={league} wallets={wallets}/>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => { 
  
  const name = context.params?.name


  const league = await prisma.league.findUnique({
    where: {
      name: name?.toString()
    },
    include: {
      fixtures: true,
      members: {
        include: {
          Trade: true,
          
        }
      }
    }
  }).then(async (data) => {
 
    await prisma.$disconnect()
    return data
   
  })

  const wallets = await prisma.wallet.findMany({})

  return {
    props: {

      league, wallets

    

    }
  }
}

export default LeaguePage;
