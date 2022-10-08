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



    const purchase = credits()
    const depositFee = Math.ceil( 0.05 * data.amount) +1


    if (data.walletkey === user?.walletkey) {
      const secret = data.userName + data.email + data.birthday + "walletkeyforsigningtransaction"
      // update the key with the new seposit and use it as txHash
      const txHsh = createHmac("sha256", secret).update(
        data.amount.toString()+ dayjs().toDate().toString()
      ).digest("hex")
      


      await prisma.wallet.upsert({
        where: { userId: user?.id },
        update: {
          balance: { increment: data.amount - depositFee },
          credits: { increment: purchase },
          Deposit: {
            create: {
            amount: data.amount as number - depositFee,
            txHash: txHsh as string,
            date: dayjs().toDate().toISOString().slice(0,10) as string,
            time: dayjs().toDate().toISOString().slice(11, 19) as string,
            userId: data.userId as string,
            credits: credits() as number,
            fees: depositFee as number,
         } },

        },
        create: {
          balance: data.amount - depositFee,
          credits: purchase,
          user: { connect: { id: user?.id } },
          Deposit: {
            create: {
            amount: data.amount as number - depositFee,
            txHash: txHsh as string,
            date: dayjs().toDate().toISOString().slice(0,10) as string,
            time: dayjs().toDate().toISOString().slice(11, 19) as string,
            userId: data.userId as string,
            credits: credits() as number,
            fees: depositFee as number,
         } },


        }
      }).then( async() => { 


        await prisma.mainWallet.update({
          where: { id: 1 },
          data: {
            balance: { increment: depositFee },
             credits : {decrement: purchase}
          },
        }).then(() => { 
          res.status(200).json(`successfully deposited $${data.amount} and awarded $${purchase} credits at a fee of $${depositFee}`)
        })
      })
    
  
    }
    else {
      res.json("your are not allowed to do this")
    }
    
  }else if(data.task === "save withdrawal") {
    const secret = data.userName + data.email + data.birthday + "walletkeyforsigningtransaction"
    const txHsh = createHmac("sha256", secret).update(
      data.amount.toString()+ dayjs().toDate().toString()
    ).digest("hex")

    const withdrawalFee = Math.ceil( 0.03 * data.amount) + 1
    
    const walletBalance = await prisma.wallet.findUnique({
      where: { userId: user?.id },
    })

    if (walletBalance?.balance as number  < (data.amount + withdrawalFee)) {
      res.json(`insufficient balance to withdraw $${data.amount} your balance is $${walletBalance?.balance}`  )
    }

    else {
      await prisma.wallet.update({
        where: { userId: user?.id },
        data: {
          balance: { decrement: (data.amount  + withdrawalFee) },
          credits: { decrement: (data.amount as number * 95)},
          Withdrawal: {
            create: {
              amount: data.amount as number - withdrawalFee,
              txHash: txHsh as string,
              date: dayjs().toDate().toISOString().slice(0, 10) as string,
              time: dayjs().toDate().toISOString().slice(11, 19) as string,
              userId: data.userId as string,
              credits: data.amount as number * 95 as number,
              fees:  withdrawalFee as number,
        
            }
          }
        }
      }).then(async () => { 
        
        await prisma.mainWallet.update({
          where: { id: 1 },
          data: {
            balance: { increment: withdrawalFee },
            credits: { increment: data.amount * 95 },
          },
        }).then(() => { 
          res.status(200).json(`successfull withdrawal of $${data.amount} and $${withdrawalFee} withdrawal fee applied credits forfeited $${data.amount * 95}`);
        })
       
      })
  }
   
  }

}
