import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import { useState } from "react";
import { InferGetServerSidePropsType } from 'next'

import { useSession, signIn, getSession, signOut } from 'next-auth/react';




function TradesPage({ league, fantasyteam }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tradeRole, setTradeRole] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [tradeResult, setTradeResult] = useState("");

  const onSelectedPlayer = (player: any) => {
    setSelectedPlayer(player);

   }

  const onSelectedPlayer2 = (player: any) => { 
    setSelectedPlayer2(player.name);
  }
  const onClickTrade = async (e: any) => { 
    e.preventDefault();
    setTradeResult("Trade in progress...");
    var fantasyname = fantasyteam
    var particpantid = league.members.find((member: any) => member.fantasyname === fantasyteam).id
    await fetch(`/api/trades/${fantasyname}`, {
    
      method: 'POST',
      body: JSON.stringify({
        leaguename: league.name,
        player1: selectedPlayer,
        player2: selectedPlayer2,
        leagueId: league.id,
        participantId: particpantid,
        tradeRole: tradeRole
        

      })
    }).then((res) => { 
      res.text().then((data) => { 
        setTradeResult(data);
        console.log(data);
      })
    })
  }

  return (
    <div className="text-white grid lg:grid-col-2 grid-flow-col m-12">
     
      <div className="container flex flex-col text-white">
        
        {
          league?.members.filter((member: any) => member.fantasyname === fantasyteam).map((member: any) => ( 
            <div key={member.id} className="flex flex-col gap-5">
              <p>team: {member.fantasyname}</p>
              <div className="flex flex-row space-x-5">
              <p >top: {member.top}</p> <button onClick={() => {
                  onSelectedPlayer(member.top)
                  setTradeRole("top")
              }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">select</button></div>
                            <div className="flex flex-row space-x-5">
              <p >jungle: {member.jungle}</p> <button onClick={() => {
                  onSelectedPlayer(member.jungle)
                  setTradeRole("jungle")
              }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">select</button></div>
                            <div className="flex flex-row space-x-5">
              <p >mid: {member.mid}</p> <button onClick={() => {
                  onSelectedPlayer(member.mid)
                  setTradeRole("mid")
              }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">select</button></div>
                            <div className="flex flex-row space-x-5">
              <p >adc: {member.adc}</p> <button onClick={() => {
                  onSelectedPlayer(member.adc)
                  setTradeRole("adc")
              }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">select</button></div>
                            <div className="flex flex-row space-x-5">
              <p >support: {member.support}</p> <button onClick={() => {
                  onSelectedPlayer(member.support)
                  setTradeRole("support")
              }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">select</button></div>
              
              </div>
          ))

        }
      </div>
      <div className="flex flex-col"><table className="table-auto bordered mb-8"><thead><tr><th className="px-4 py-2">player out</th><th className="px-4 py-2">player in</th></tr></thead><tbody><tr className="border  border-gray-700"><td className="p-2">{selectedPlayer ? selectedPlayer : "......"}</td><td className="p-2">{selectedPlayer2 ? selectedPlayer2 : "......"}</td><td className="p-2"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClickTrade}>trade</button></td></tr></tbody></table>{
        tradeResult ? <p>{tradeResult}</p> : null
      }</div>
        <div className="h-[500px] overflow-y-scroll border mx-auto  p-5">
        {/* MAP PLAYERS TO A TABLE WITH HEADERS NAME ROLE TEAM SELECTED */}
        
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Selected</th>
              <th className="px-4 py-2">Select</th>
            </tr>

          </thead>
          <tbody>
            {
              league.players.map((player: any) => (
                <tr key={player.id} className="border-b border-gray-700">
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.position}</td>
                  <td className="p-2">{player.team}</td>
                  <td className="p-2">{`${player.selected}`}</td>
                  <td className="p-2"><button onClick={() => { onSelectedPlayer2(player)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Select</button></td>

                  

                  </tr>
              ))
            }
            </tbody>
          </table>
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
