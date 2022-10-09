import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players, Withdrawal, Deposit, Wallet } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'
import { DepositsPage } from "@components";
import {WithdrawPage} from "@components";




const UserWallet = ({ owner, wallet, withdrawals, deposits }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
 


  useEffect(() => { 

    if (owner.verificationCode === null || owner.verificationCode === "" || owner.emailVerified=== false) {
      window.location.href = "/user/verify"
    }
  } ,[owner.verificationCode])
 
 
  

  return (<div  style={{color:"white"}}>
    <Grid>
    <div className={s.container}>
      <p> name : {
        
      owner.name
    
    }</p>

    <p> balance: ${
      wallet.balance
    } </p>

      <p>
        credits:
      {
        wallet.credits
        }
       
    </p>
      </div>
    </Grid>
    <div className={s.root}>
      

      <WithdrawPage owner={ owner}  wallet={wallet}  />

        
        
        
      </div>
      <div className={s.root}><DepositsPage owner={ owner} wallet={wallet}  /></div>
    <Grid>
    <div className={s.root}>
      <h1> withdrawals </h1>

      {
        withdrawals.map((withdrawa: Withdrawal) => {
          return (<div key={withdrawa.id} className={s.container}>
            <p>amount: ${withdrawa.amount}</p>
            <p>date: {withdrawa.date}</p>
            <p>time: {withdrawa.time}</p>
            <p>creditsdeducted: {
              withdrawa.credits
            }</p>
          </div>)

        })
      }
      </div>
      </Grid>
    <div className={s.root}>
      <h1> Deposits </h1>

      {
        deposits.map((withdrawa: Deposit) => {
          return (<div key={withdrawa.id} className={s.container}>
            <p>amount: ${withdrawa.amount}</p>
            <p>date: {withdrawa.date}</p>
            <p>time: {withdrawa.time}</p>
            <p>creditsaddedd: {
              withdrawa.credits
            }</p>
          </div>)

        })
      }
    </div>
    

 
  
  
  </div>)
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

  const wallet = await prisma.wallet.findUnique({
    where: {
      userId: owner?.id
    }
  }).then((result) => {
    return result
  })

  const withdrawals = await prisma.withdrawal.findMany({
    where: {
      userId: owner?.id
    }
  }).then((result) => { 
    return result
  })

  const deposits = await prisma.deposit.findMany({
    where: {
      userId: owner?.id
    }
  }).then((result) => { 
    return result
  })

  return {
    props: {
      owner, wallet, withdrawals, deposits
    }
  }
 }



export default UserWallet
