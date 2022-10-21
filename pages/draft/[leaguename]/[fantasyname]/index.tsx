import { Fixture, Teams, League, Players, Participant } from "@prisma/client"
import prisma from "@lib/prisma";
import { GetServerSideProps } from 'next'
import { Grid } from '@components/ui';
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useEffect, useState } from "react";
import io, { Socket } from 'Socket.IO-client'
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next'
import dayjs from "dayjs";


import { DefaultEventsMap } from "@socket.io/component-emitter";


const socket = io(
  {
    autoConnect: false
  }
);

function Draft({ focusonleague, focusonparticipant, userId, teams, players }: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const [usernamealreadyselected, setUsernamealreadyselected] = useState(false)
  const [watu, setWatu] = useState([{ connected: false, self: true, userID: "", username: "", isReady: false}])
  const [draftPeople, setDraftPeople] = useState([{ adc: "", jungle: "", mid: "", support: "", top: "", team: "", username: "", leaguename: "", leagueId: 0, id: 0 }])
  const [message, setMessage] = useState("")
  const [message2, setMessage2] = useState("")
  const [counter, setCounter] = useState(0)
  const [balance, setBalance] = useState(0)
  const [picked, setPicked] = useState(false)





  const emitPlayerReady = () => {
    socket.emit("imready")
  }

  const letmein = async () => {
    const username = focusonparticipant.fantasyname
    socket.auth = { username };
    socket.connect();

  }
  useEffect(() => {

    if (picked) {
      socket.emit("playerpicked")
      setPicked(false)
    
    }
   }, [picked])
  useEffect(() => {

    if (focusonparticipant.confirmedAttendance === false) {
      window.location.href = `/draft/${focusonleague.leaguename}/${focusonparticipant.fantasyname}/confirmdraft`
    }
  }, [focusonparticipant])


  useEffect(() => {


    socket.on("people", (data: any) => {
      console.log(data);
      setDraftPeople(data)
    })
    return () => {
      socket.off("people")

    }

  }, [draftPeople])


  useEffect(() => {


    socket.on("balance", (data: any) => {
      console.log(data);
      setBalance(data)
    })
    return () => {
      socket.off("balance")
    }

  }, [balance])









  useEffect(() => {
    socket.on("counter", (count: any) => {
      setCounter(count);
    })

  }, [counter])
  useEffect(() => {
    socket.on("draftposition", (data: any) => {
      console.log(data)

    })
    return () => {
      socket.off("draftposition")
    }
  }, [])














  useEffect(() => {

    socket.on("message2", (message2: any) => {

      setMessage2(message2)
    })

    return () => {

      socket.off("message2")
    }
  }, [])

  useEffect(() => {

    socket.on("message", (message: any) => {

      setMessage(message)
    })

    return () => {

      socket.off("message")
    }
  }, [])
  useEffect(() => {

    socket.onAny((event: any, ...args: any) => {
      console.log(event, args);
    })


    return () => {
      socket.offAny()
    }
  }, [])

  useEffect(() => {

    const sessionID = sessionStorage.getItem("sessionID");
    if (sessionID) {

      socket.auth = { sessionID };
      socket.connect();

    }

    socket.on("session", ({ sessionID, userID }) => {

      socket.auth = { sessionID };


      sessionStorage.setItem("sessionID", sessionID);

      (socket as any).userID = userID;




    });



    socket.on("connect_error", (err: { message: string; }) => {
      if (err.message === "invalid username") {
        console.log("invalid username")

      }
    });



    return () => {
      socket.off("connect_error")
    }
  }

    , [])




  useEffect(() => {
    socket.on("connect", () => {

      socket.emit("joinRoom", focusonleague.name)


      watu.forEach((user: { self: any; connected: boolean; }) => {
        if (user.self) {
          user.connected = true;


        }
      })
    })

    socket.on("disconnect", () => {

      watu.forEach((user: { self: any; connected: boolean; }) => {
        if (user.self) {
          user.connected = false;
        }
      })
    })

    socket.on("users", (users: any[]) => {
      users.forEach((user: any) => {
        for (
          let i = 0; i < watu.length; i++
        ) {

          const existingUser = watu[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            return
          }
        }

        user.self = user.userID === (socket as any).userID;
        watu.push(user);

        setWatu([...watu])



      })

      watu.sort((a: { self: any; username: string; }, b: { self: any; username: string; }) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      })




    })

    socket.on("user connected", (user: { userID: any; username: string, isReady: boolean }) => {

      for (let i = 0; i < watu.length; i++) {
        const existingUser = watu[i];

        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      watu.push({
        connected: true,
        self: user.userID === (socket as any).userID,
        userID: user.userID,
        username: user.username,
        isReady: user.isReady

      })

      setWatu([...watu])

    })




    socket.on("user disconnected", (id: any) => {

      for (let i = 0; i < watu.length; i++) {
        const existingUser = watu[i];

        if (existingUser.userID === id) {
          existingUser.connected = false;
          break;
        }
      }



    })

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");

      socket.off("user disconnected");
    }




  }, [])


  return (
    <>

      <div style={{ display: "flex", flexDirection: "row" }}>

        <Grid>
          <div className={s.container} style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center", width: "500px" }}   >

            <h1> Draft</h1>
            <h2>leaguename: {focusonleague.name}</h2>
            <h3>fantasyname: {focusonparticipant.fantasyname}</h3>
            <h4> draftposition: {focusonparticipant.draftOrder}</h4>

          </div>
        </Grid>
        <Grid>
          <div className={s.container} style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center", width: "500px" }} >
            <h1 style={{ color: "#ffd204" }}>{balance == 0 ? null : (<>balance : {balance}</>)}</h1>
            <h1 style={{ color: "#ffd204" }}>{counter == 0 ? "wait your turn" : "timer: " + dayjs().set("minute", counter/60000).minute(counter/60000).format("mm:ss")
            
            }</h1>

            {
              message ? (<div style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center" }} ><h1>draft events</h1><p style={{ color: "#ffd204" }}>{message}</p></div>) : (<p style={{ color: "#ffd204" }}>draftlog</p>)
            }


            <div >


              {
                message2 ? (<h1 style={{ color: "#ffd204" }}>{message2}</h1>) : (<h1 style={{ color: "#ffd204" }}></h1>)
              }</div>
          </div>
        </Grid>


        <Grid>
          <div className={s.container} style={{ color: "#ffd204", display: "flex", flexDirection: "column", justifyContent: "center", width: "500px" }}>
            <h1>users in room</h1>
            {watu?.map((user) => {
              return (

                <span key={user.userID}>{user.username} {focusonleague.room}</span>



              );



            })}
          </div>
        </Grid>

      </div>

      <Grid>
        <div className={s.container} style={{ color: "#ffd204", display: "flex", flexDirection: "row", justifyContent: "space-between", width: "500px" }}>
          <button style={{ color: "#ffd204", float: "left" }} onClick={letmein}>enter room</button> <br />



          <button style={{ color: "#ffd204" }} onClick={emitPlayerReady}>are you ready?</button><br />
        </div>

      </Grid>
      <Grid>
        <div className={s.container} style={{ width: "1000px" }}>
          <table style={{ color: "#ffd204", width: "1000px" }} hidden={false}>
            <thead>
              <tr>
                <th scope="col">FANTASYNAME</th>
                <th scope="col">Top</th>
                <th scope="col">JNG</th>
                <th scope="col">MID</th>
                <th scope="col">BOT</th>
                <th scope="col">SUP</th>

                <th scope="col">TEAM</th>

              </tr>
            </thead>
            <tbody>
              {
                draftPeople.map((participant: any) => (
                  <tr key={participant.id} >
                    <td>{participant.fantasyname}</td>
                    <td>{participant.top}</td>
                    <td>{participant.jungle}</td>
                    <td>{participant.mid}</td>
                    <td>{participant.adc}</td>

                    <td>{participant.support}</td>
                    <td>{participant.team}</td>
                  </tr>
                ))
              }
            </tbody>

          </table>
        </div>
      </Grid>
      <Grid>

        <div className={s.container} style={{ color: "#ffd204", display: "flex", flexDirection: "row", justifyContent: "space-between", width: "1000px" }} >




          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "1000px" }}>
            <table style={{ color: "#ffd204" }} hidden={false}>

              <thead>
                <tr>
                  <th scope="col">TEAM NAME</th>


                </tr>
              </thead>
              <tbody>
                {
                  teams.map((team: Teams) => (
                    <tr key={team.id} onClick={
                      () => {
                        socket.emit("draftPick", {
                          name: team.name,
                          fantasyname: focusonparticipant.fantasyname,
                          role: "Team",
                          draftName: focusonleague.name,
                          leagueId: focusonleague.id,
                          choiceId: team.id,
                          userId: userId

                        })

                        setPicked(true)



                      }
                    }>
                      <td>{team.name}</td>


                    </tr>
                  ))
                }
              </tbody>

            </table>
            <div className={s.container}></div>
            <table style={{ color: "#ffd204" }} hidden={false}>

              <thead>
                <tr>
                  <th scope="col">playername</th>
                  <th scope="col">player team</th>
                  <th scope="col">role</th>



                </tr>
              </thead>
              <tbody>
                {
                  players.filter((player: Players) => {
                    if (player.position === "Top" || player.position === "Jungle" || player.position === "Mid" || player.position === "Bot" || player.position === "Support") {

                      return player


                    }
                  }).map((player: Players) => (
                    <tr key={player.id} onClick={
                      () => {

                        socket.emit(
                          "draftPick",
                          {
                            name: player.name,
                            fantasyname: focusonparticipant.fantasyname,
                            role: player.position,
                            draftName: focusonleague.name,
                            leagueId: focusonleague.id,
                            choiceId: player.id,
                            userId: userId



                          }

                        )
                        setPicked(true)

                      }
                    }>

                      <td>{player.name}</td>
                      <td>{player.team}</td>
                      <td>{player.position}</td>
                      <td>{player.points}</td>


                    </tr>
                  ))
                }
              </tbody>

            </table>

          </div>

        </div>


      </Grid>


      {
      }
    </>
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
  const leaguename = context.params?.leaguename as string
  const fantasyname = context.params?.fantasyname as string
  const focusonleague = await prisma.league.findUnique({
    where: {
      name: leaguename,
    },
    include: {
      members: true,
      teams: true,
      players: true,
    }
  }).then(async (league) => {
    await prisma.$disconnect()
    return league

  })
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    }
  })

  const focusonparticipant = focusonleague?.members.find((member) => {
    return member.fantasyname === fantasyname
  })
  const participants = focusonleague?.members
  const teams = focusonleague?.teams

  const players = focusonleague?.players.filter((player) => {
    player.selected === false
  })

  const userId = user?.id

  return {
    props: { focusonleague, focusonparticipant, participants, teams, players, userId },
  }
}


export default Draft
