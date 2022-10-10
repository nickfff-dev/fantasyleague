import type { NextApiRequest, NextApiResponse } from 'next';
import { League as Mchezo, Fixture, Teams, Players, Participant } from "@prisma/client"


import prisma from '@lib/prisma';
import cargo from '@lib/cargo';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const MY_GMAIL = "jumanaturetech@gmail.com"
  const MY_GMAIL_PASSWORD = "jytm khdc rxwu kxwy"
  const transporter = nodemailer.createTransport(({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: MY_GMAIL,
      pass: MY_GMAIL_PASSWORD
    }
  }));
  const data = JSON.parse(req.body)
  const makeInviteCode = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  if (data.task === "enroll") {

    const leaguename = data.leaguename
    const username = data.username
    const teamname = data.teamname
    const userId = data.userId
    const inviteOnly = data.inviteOnly
    const buyIn = data.buyIn
    const buyInFee = data.buyInFee
    const email = data.email
    const leagueId = data.leagueId
    const league = await prisma.league.findUnique({
      where: {
        id: leagueId
      }
    }).then(async (data) => {
      await prisma.$disconnect()
      return data
    })

    const enrolledparticipants = await prisma.participant.findMany({
      where: {
        leagueId: leagueId
      }
    }).then(async (data) => {
      await prisma.$disconnect()
      return data
    })

    if ((league?.maxPlayers as number) > enrolledparticipants.length) {
      if (inviteOnly === "false" && buyIn === "false") {
        await prisma.league.update({
          where: {
            name: leaguename
          },
          data: {
            members: {
              create: {
                username: username,
                fantasyname: teamname,
                leaguename: leaguename,
                inviteCode: null,
                inviteComplete: true,
                userId: userId,


              }
            }
          }
        }).then(async () => {
          await prisma.$disconnect()
        })

        res.status(200).send("success")
      } else 
        if (inviteOnly === "true" && buyIn === "false") {
          const inviteCode = makeInviteCode()
          const mailOptions = {
            from: MY_GMAIL,
            to: email,
            subject: `InviteCode to ${leaguename}`,
            text: `Hello ${teamname}, you have been invited to join ${leaguename}. Your invite code is ${inviteCode}`

          }
          transporter.sendMail(mailOptions, async (err, data) => {
            if (err) {
              res.status(200).send("verification failed refresh and try again")

            }
            else if (data) {
              await prisma.league.update({
                where: {
                  name: leaguename
                },
                data: {
                  members: {
                    create: {
                      username: username,
                      fantasyname: teamname,
                      inviteCode: inviteCode,
                      leaguename: leaguename,
                      inviteComplete: false,
                      userId: userId,
                    }
                  }


                }

              }).then(async () => {
                await prisma.$disconnect();

              })

            }
          })
          res.status(200).send(`sent code to ${email} ${teamname}`)

        } else if (inviteOnly === "false" && buyIn === "true") {
          const walletbalance = await prisma.wallet.findUnique({
            where: {
              userId: userId
            }
          })
          if (walletbalance && (walletbalance.balance > buyInFee)) {


            await prisma.league.update({
              where: {
                name: leaguename
              },
              data: {
                members: {
                  create: {
                    username: username,
                    fantasyname: teamname,
                    inviteCode: null,
                    leaguename: leaguename,
                    inviteComplete: true,
                    userId: userId,

                  }
                }
              }
            }).then(async () => {

              await prisma.wallet.update({
                where: {
                  userId: userId
                },
                data: {
                  balance: {
                    decrement: buyInFee

                  },
                  credits: {
                    decrement: buyInFee * 95
                  }
                }
              })
            })

            res.status(200).send("success")
          } else {
            res.status(200).send("insufficient funds")
          }

        } else if (inviteOnly === "true" && buyIn === "true") {
          const walletbalance = await prisma.wallet.findUnique({
            where: {
              userId: userId
            }
          })
          if (walletbalance && (walletbalance.balance > buyInFee)) {
            const inviteCode = makeInviteCode()
            const mailOptions = {
              from: MY_GMAIL,
              to: email,
              subject: `InviteCode to ${leaguename}`,
              text: `Hello ${teamname}, you have been invited to join ${leaguename}. Your invite code is ${inviteCode}`

            }
            transporter.sendMail(mailOptions, async (err, data) => {
              if (err) {
                res.status(200).send("verification failed refresh and try again")
              }
              else if (data) {
                await prisma.league.update({
                  where: {
                    name: leaguename
                  },
                  data: {
                    members: {
                      create: {
                        username: username,
                        fantasyname: teamname,
                        inviteCode: inviteCode,
                        leaguename: leaguename,
                        inviteComplete: false,
                        userId: userId,
                      }
                    }
                  }
                }).then(async () => {
                  await prisma.user.update({
                    where: {
                      email: email
                    },
                    data: {
                      Wallet: {
                        update: {
                          where: {
                            userId: userId
                          },
                          data: {
                            balance: {
                              decrement: buyInFee
                            },
                            credits: {
                              decrement: buyInFee * 95
                            }
                          }
                        }
                      }
                    }
                  })
                })
              }

            })

            res.status(200).send(`sent code to ${email} ${teamname}`)
          } else {
            res.status(200).send("insufficient funds")
          }


        }
      
    } else { 
      res.status(200).send("league full")
    }





  } else if (data.task === "verifyInviteCode") {
    const teamname = data.teamname
    const leaguename = data.leaguename
    const inviteCode = data.inviteCode


    const verifyInviteCode = await prisma.participant.findMany({
      where: {
        inviteCode: inviteCode,
      }

    }).then(async (data) => {
      await prisma.$disconnect();
      return data;
    });
    console.log(verifyInviteCode[0])
    if (verifyInviteCode && verifyInviteCode[0].inviteCode === inviteCode) {
      await prisma.league.update({
        where: {
          name: leaguename
        },
        data: {
          members: {
            update: {
              where: {
                id: verifyInviteCode[0].id

              },
              data: {
                inviteComplete: true
              }
            }
          }

        }
      }).then(async () => {
        await prisma.$disconnect();

      });
      res.status(200).send("success")




    } else {
      res.status(200).send("incorrect invite code")

    }



  }

}
