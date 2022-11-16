import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'

import { InferGetServerSidePropsType } from 'next'

import { useSession, signIn, getSession, signOut } from 'next-auth/react';




function TradesPage({ league, fantasyteam }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  return (
    <div className="text-white grid lg:grid-col-2 grid-flow-col m-12">
     
      <div className="container flex flex-col text-white">

        {
          league?.members.filter((member: any) => member.fantasyname === fantasyteam).map((member: any) => ( 
            <div key={member.id} className="flex flex-col">
              <p>team: {member.fantasyname}</p>
              <p>top: {member.top}</p>
              <p>jungle: {member.jungle}</p>
              <p>mid: {member.mid}</p>
              <p>adc: {member.adc}</p>
              <p>support: {member.support}</p>
              
              </div>
          ))

        }
        </div>
        <div className="h-[500px] overflow-y-scroll border mx-auto  p-5">
        {
          league?.players.map((player: any) => (
            <div key={player.id} className="flex flex-row space-x-5">
              <p>name: {player.name}</p>
              <p>role: {player.role}</p>
              <p>team: {player.team}</p>
              <p>selected: {`${player.selected}`}</p>
            </div>
          ))
        }
        </div>
     
      
      

    
    </div>)
}


export const getServerSideProps: GetServerSideProps = async (context) => { 
  const fantasyteam = context.params?.fantasyname
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  const league = await prisma.league.findUnique({
    where: {
      name: context.params?.leaguename as string,
    },
    include: {
      members: true,
      players: true
    }
  })


  return {
    props: {
     league, fantasyteam
    }
  }

}


export default TradesPage
