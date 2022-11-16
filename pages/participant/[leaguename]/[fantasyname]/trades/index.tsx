import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import { useState } from "react";
import { InferGetServerSidePropsType } from 'next'

import { useSession, signIn, getSession, signOut } from 'next-auth/react';




function TradesPage({ league, fantasyteam }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const { data: session } = useSession()
  const onSelectedPlayer = (player: any) => {
    setSelectedPlayer(player);
   }

  const onSelectedPlayer2 = (player: any) => { 
    setSelectedPlayer2(player.name);
  }
  const onClickTrade = async (e: any) => { 
    e.preventDefault();
    var fantasyname = fantasyteam
   
    await fetch(`/api/trades/${fantasyname}`, {
      method: 'POST',
      body: JSON.stringify({
        leaguename: league.name,
        player1: selectedPlayer,
        player2:  selectedPlayer2,

      })
    })
  }

  return (
    <div className="text-white grid lg:grid-col-2 grid-flow-col m-12">
     
      <div className="container flex flex-col text-white">
        
        {
          league?.members.filter((member: any) => member.fantasyname === fantasyteam).map((member: any) => ( 
            <div key={member.id} className="flex flex-col">
              <p>team: {member.fantasyname}</p>
              <p onClick={() => {
                onSelectedPlayer(member.top)
              }}>top: {member.top}</p>
              <p  onClick={() => {
                onSelectedPlayer(member.jungle)
              }}>jungle: {member.jungle}</p>
              <p onClick={() => {
                onSelectedPlayer(member.mid)
              }}>mid: {member.mid}</p>
              <p  onClick={() => {
                onSelectedPlayer(member.adc)
              }}> adc: {member.adc}</p>
              <p  onClick={() => {
                onSelectedPlayer(member.support)
              }}>support: {member.support}</p>
              
              </div>
          ))

        }
      </div>
      {
        selectedPlayer && selectedPlayer2 ? (<div><p>trade {selectedPlayer} with { selectedPlayer2} ?</p><button onClick={onClickTrade}>trade</button></div>) : null
      }
        <div className="h-[500px] overflow-y-scroll border mx-auto  p-5">
        {
          league?.players.map((player: any) => (
            <div key={player.id} className="flex flex-row space-x-5" onClick={
              () => {
                onSelectedPlayer2(player)
             }
            }>
              <p>name: {player.name}</p>
              <p>role: {player.position}</p>
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
