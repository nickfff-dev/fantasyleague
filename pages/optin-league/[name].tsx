import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, getSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'








const JoinLeague = ({ league, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  
  useEffect(() => { 

    if (user.verificationCode === null || user.verificationCode === "" || user.emailVerified=== false) {
      window.location.href = "/user/verify"
    }
  } ,[user.verificationCode])
  const [teamName , setTeamName] = useState("");
  const { data: session } = useSession();
  const [responsetext, setResponseText] = useState("")
  const [invitecode, setInviteCode] = useState("")
  const [initiateInvite, setInitiateInvite] = useState(false)

  const enrollToleague = async () => {
    let leaguename = league.name
    let username = session?.user?.name?.toString()
    let teamname = teamName
    let email = session?.user?.email
    let userId = user.id
    let inviteOnly = league.inviteOnly
    let buyIn = league.buyIn
    let buyInFee = league.buyInFee
    let leagueId = league.id
    let task = "enroll"
   
    
    try {
      await fetch(` http://localhost:3000/api/optin-league/${league.name}`, {
        method: 'POST',
        body: JSON.stringify({
          leaguename,
          username,
          teamname,
          userId,
          inviteOnly,
          buyIn,
          buyInFee,
          email,
          leagueId,
          task
        })
      }).then((res) => {
        res.text().then((data) => {
          if (data === "success") {
            console.log(data)
            setInitiateInvite(false)
            setResponseText("You have successfully enrolled in this league")
            window.location.href = `/league-summary/${league.name}`
          } else if (data.startsWith("sent code to")) {
            console.log(data)
            setInitiateInvite(true)
            setTeamName(data.split("sent code to")[1])
            setResponseText(`This league is invite only, please enter the invite code sent to ${user.email}`)
          } else if (data === "insufficient funds") {
            console.log(data)
            setResponseText("You do not have enough funds to enroll in this league please deposit more funds")
             
            window.location.href = "/user/wallet"
          } else if (data === "league full") { 
            console.log(data)
            setResponseText("This league is full")


          }
         
          
        
       })
  
      })

    } catch (err: any) { 
      console.error(err.message);
    }
  
  }




  return (<>
    <div className={s.container}>
      
      
      {
        initiateInvite ? <label htmlFor="invitecode" >Invite Code<input value={invitecode} type="text" name="invitecode" onChange={ 
          (e) => { 
            setInviteCode(e.target.value)
          }
        } /><input type="submit" value="Submit" onClick={ 
            async () => {
              await fetch(`/api/optin-league/${league.name}`, {
                method: "POST",
                body: JSON.stringify({
                  inviteCode: invitecode,
                  leaguename: league.name,

                  teamname: teamName,
                  task: "verifyInviteCode"
                })
              }).then((res) => { 
                res.text().then((data) => { 
                  console.log(data)
                  if (data === "success") {
                    window.location.href = `/league-summary/${league.name}`
                  } else { 
                    setResponseText("Invite code is invalid")
                  }
                })
              })
            }} /></label> :(<>      <label htmlFor="leaguename" >League Name
        <input defaultValue={league.name} /> </label>
      <label htmlFor="username" >yourusername
        <input defaultValue={session?.user?.name?.toString()} /> 
      </label>

      <label htmlFor="teamname" >Team Name 
        <input name ="teamname"  onChange={
          (e) => { 
            setTeamName(e.target.value)
          }
        } />
      </label>
      <button onClick={enrollToleague}>click to enroll</button>
      <h1 style={{color: "white"}}>{
      responsetext? responsetext : "Join a League"
      }</h1></>)
}
    </div>
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
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string
    }
  })
  const name = context.params?.name
  const league  = await prisma.league.findUnique({
    where: {
      name: name?.toString()
    }
  })


  return {
    props: { league, user }
  }
  
}





export default JoinLeague
