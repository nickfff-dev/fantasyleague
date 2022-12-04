import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';


import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'

import dayjs from "dayjs";
import UserProfile from "@components/User/Profile.";


const UserAccount = ({ owner, leagues }: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
  const [usernewname, setUser] = useState("");
  const [birthDate, setBirthDate] = useState(owner.birthDate);
  

  useEffect(() => { 

    if (owner.verificationCode === null || owner.verificationCode === "" || owner.emailVerified=== false) {
      window.location.href = "/user/verify"
    }
  } ,[owner.verificationCode])
  const onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setUser(e.target.value);


  }
  const onBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setBirthDate(dayjs(e.target.value).toDate().toISOString());
    console.log (dayjs(e.target.value).toDate().toISOString());
    
  }


  
  const onUserNameSubmit = async () => {   

  
     
    const userName = usernewname
    const birthDay = birthDate
     const email = owner.email
    const task = "save user"
    const name = owner.name
    
    try {
      await fetch(`/api/user/${name}`, {
        method: "POST",
        body: JSON.stringify({ 
          userName,
          email,
          birthDay,
          task
         })
      }).then((res) => {
        res.text().then((data) => {
          console.log(data);
        })
      })
   
 }catch (error) {
      console.log(error);
    }
  }
  



  return (
    <>
      <UserProfile/>
    {/* <div className="grid grid-flow-col gap-5  auto-cols-max text-white m-3 overflow-hidden">
      
      <div className={`${s.container} mt-5  `}>
     
        <div className="flex flex-col">
        
        <h2 className={s.subtitle}>Welcome {owner.name}</h2>
        <h2>Email: {owner.email}</h2>
        <h2 >{
          owner.userName ? `Username:  ${owner.userName}` : `username: You need to add your username below`

        
        }</h2>
             <h2 className={s.subtitle}>{
          owner.birthDate ? `Birthdate:  ${owner.birthDate}` : `birthdate: You need to add your birthdate below`

        
        }</h2>
        
        
        <p>Locale: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
    </div>



      </div>

      
      

            {
              owner.userName && owner.birthDate ? null:(<div className={s.container}><form method="POST" onSubmit={onUserNameSubmit}>
              { !owner.userName ? (<label htmlFor="userName">enteruseRname<input type="text" name="userName" onChange={onUserNameChange} /></label>):null}
               { owner.birthdate ?( <label htmlFor="birthDate">enterbirthdate<input type="date" name="birthDate" onChange={onBirthDateChange} /></label>):null}
               <input type="submit" value="Submit" />
           </form></div>
  )
            }
        
        
      

      
 <div className="container bg-gray-600 p-10 rounded-lg" ><h1 className={s.title} style={{textAlign:"center"}}>Leagues</h1>
    
      
</div>
     

       
      
      
    </div> */}
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
  const username  = session?.user?.name as string
  const owner = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
      
    }
  }).then((data) => {
    return data
  })
 
  const leagues = await prisma.league.findMany({
    where: {
      members: {
        some: {
          username: username
        }
      }

    },
    include: {
      members: true
    } 
  })

  return {
    props: {
      owner, leagues
    }
  }
 
 }
  









export default UserAccount
