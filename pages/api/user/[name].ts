import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@lib/prisma';
import dayjs from 'dayjs';
import  crypto  from 'crypto';



export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 


  const { createHmac } = crypto;

  const data = JSON.parse(req.body)
  const user = await prisma.user.findUnique({
    where: {
      email : data.email
    }
  }).then((data) => {
    return data
  })
  if (data.task === "save user") {

    
    const secret = data.userName + data.email + data.birthday + "walletkeyforsigningtransaction"
    const hash = createHmac('sha256', secret).digest('hex');


    await prisma.user.update({
      where: { email: data.email },
      data: { userName: data.userName, birthDate: data.birthDay,  walletkey: hash  },
    }).then(() => {
      res.status(200).json("success");
    })
    
  }
  

  else if (data.task === "save deposit") {
    const credits = () => {
      return   95 * data.amount
         
    }






    if (data.walletkey === user?.walletkey) {
      const secret = data.userName + data.email + data.birthday + "walletkeyforsigningtransaction"
  // update the key with the new seposit and use it as txHash
      const txHsh = createHmac("sha256", secret).update(
        data.amount.toString()+ dayjs().toDate().toString()
      ).digest ("hex")
    
      await prisma.wallet.findUnique({
        where: { userId: data.userId },
      }).then(async (wallet) => {
        if (!wallet) {
          const purchase = credits()
          await prisma.user.update({
            where: { email: data.email },
            data: {
              Wallet: { create: { balance: data.amount, credits: purchase } },
            },
          }).then(async () => { 
            await prisma.wallet.update({
              where: { userId: data.userId },
              data: {
                Deposit: {
                  create: {
                    amount: data.amount as number,
                    txHash: txHsh as string,
                    date: dayjs().toDate().toISOString().slice(0,10) as string,
                    time: dayjs().toDate().toISOString().slice(11, 19) as string,
                    userId: data.userId as string,
                    credits: credits() as number,
                
                  }
                },
              }
            }).then(() => {
              res.status(200).json("success")
            })

          })




        } else { 
          await prisma.wallet.update({
            where: { userId: data.userId},
            data: {
              balance: wallet.balance as number + data.amount as number,
              credits: wallet.credits as number + credits() as number,
              Deposit: {
                create: {
                  amount: data.amount as number,
                  txHash: txHsh as string,
                  date: dayjs().toDate().toISOString().slice(0,10) as string,
                  time: dayjs().toDate().toISOString().slice(11, 19) as string,
                  userId: data.userId as string,
                  credits: credits() as number,
              
                }
              },
            }
          }).then(() => {
            res.status(200).json("success")
          })
        }

      })
    }
    else {
      res.json("your are not allowed to do this")
    }
    
  }else if(data.task === "save withdrawal") {
    const secret = data.userName + data.email + data.birthday + "walletkeyforsigningtransaction"
    const txHsh = createHmac("sha256", secret).update(
      data.amount.toString()+ dayjs().toDate().toString()
    ).digest ("hex")
    await prisma.wallet.findUnique({
      where: { userId: data.userId },
    }).then(async (wallet) => {
      if (!wallet) {
        res.json("you dont have a wallet")
      } else { 
        await prisma.wallet.update({
          where: { userId: data.userId},
          data: {
            balance: wallet.balance as number - data.amount as number,
            credits: wallet.credits as number - (data.amount *95),
            Withdrawal: {
              create: {
                amount: data.amount as number,
                txHash: txHsh as string,
                date: dayjs().toDate().toISOString().slice(0,10) as string,
                time: dayjs().toDate().toISOString().slice(11, 19) as string,
                userId: data.userId as string,
                credits:  data.amount as number * 95 as number,
            
              }
            },
          }
        }).then(() => {
          res.status(200).json("success")
        })
      }

    })
  }

}
