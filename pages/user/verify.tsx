import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router';



const VerifyUser = ({ owner }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [verificationCode, setVerificationCode] = useState(0);
  const [newCode , setNewCode] = useState(0);
  const [verified, setVerified] = useState(false);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }
  const onVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(Number(e.target.value));
  }

  // useEffect(() => { 



  //   if (verified) {
  //     window.location.href = "http://localhost:3000/user/profile";
  //   }
  // }, [verified])

  const onVerificationCodeSubmit = async () => { 
    if (verificationCode === newCode) {
      window.location.href = "http://localhost:3000/user/profile";
    } 
  }
  const onVerifyUser = async () => { 
    try {
      await fetch(`/api/user/verify`, {
        method: "POST",
        body: JSON.stringify({
          email: owner.email,
          name: owner.name,
        })
      }).then((res) => { 
        res.text().then((data) => {
          console.log(data);
           if (data.includes("success")) {
             setVerified(true);
             setNewCode(Number(data.split(" ")[1]));
            
          }
         })

      })
     } catch (error) { 
      console.log(error);
    }
  }

  return (<Grid>
    <div className={s.container} style={{color: "white"}}> 
        
    {
      verified ? (
       <label  htmlFor="verificationcode">check your email and enter code<input name="verificationcode" type="text"  onChange={onVerificationCodeChange} />
        <button onClick={onVerificationCodeSubmit}  type ="submit" value="Submit">submit</button></label>
    ) : (<><button onClick={onVerifyUser}>click to send verification code</button></>)
    }
</div>
  
  </Grid>)
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

  const owner = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
      
    }
  }).then((data) => {
    return data
  })
 

  return {
    props: {
      owner
    }
  }
 
 }


export default VerifyUser
