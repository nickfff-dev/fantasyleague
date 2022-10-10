import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
import nodemailer from 'nodemailer';




export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) { 
 const resdata = JSON.parse(req.body)
  
const MY_GMAIL ="jumanaturetech@gmail.com"
  const MY_GMAIL_PASSWORD = "jytm khdc rxwu kxwy"
  const subject = "Welcome to Jumanature"
  const verificationCode = Math.floor(Math.random() * 1000000)

  const transporter = nodemailer.createTransport(({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: MY_GMAIL,
      pass: MY_GMAIL_PASSWORD
    }
  }));
  
  const mailOptions = {
    from: MY_GMAIL,
  to: resdata.email,
    subject: subject,
    text: `Hello ${resdata.name}, welcome to Jumanature. Your verification code is ${verificationCode}`,
  }
  
  transporter.sendMail(mailOptions, async (err, data) => { 
    if (err) {
      res.status(500).json("verification failed refresh and try again")
    }
    else if (data) { 
      await prisma.user.update({
        where: { email: resdata.email },
        data: {verificationCode: verificationCode, emailVerified: true}
      })
    }
     
  })
  res.status(200).send(`success ${verificationCode}`)

}
