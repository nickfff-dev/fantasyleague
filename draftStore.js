const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
class draftStore {
  saveDraft(draft) { }
  getDraft(draftName) { }
  addDraftMember(draftName, member) { }
  getDraftMembers(draftName) { }
  updateDraftMemberDraftOrder(draftName, FantasyName, updateValue) { }
  updateDraftPick(FantasyName, updatePosition, updateValue) { }
  deleteDraftMember(draftName, FantasyName) { }
  getDraftMemberWallet(userId){}


}


class DraftManager extends draftStore {
  constructor() {
    super();
    this.drafts = []
  }
  saveDraft(draft) { 
    this.drafts.push (draft)
  }

  getDraft(draftName) { 
    return this.drafts.filter(draft => draft.name === draftName)
  }
   
  
  addDraftMember(draftName, member) {
    const draft = this.drafts.filter(draft => draft.name === draftName)
    draft.members.push(member)
  }
  updateDraftMemberDraftOrder(draftName, FantasyName, updateValue) {
    const draft = this.drafts.filter(draft => draft.name === draftName)
    const member = draft.members.filter(member => member.fantasyname === FantasyName)
    draft.members.set(member, {
      ...member,
      draftOrder: updateValue,
    })
  }
  updateDraftPick(FantasyName, updatePosition, updateValue) { 
    const draft = this.drafts.filter(draft => draft.name === draftName)
    const member = draft.members.filter(member => member.fantasyname === FantasyName)
    draft.members.set(member, {
      ...member,
      [updatePosition]: updateValue,
    })
    
  }
  deleteDraftMember(draftName, FantasyName) {
   
    const draft = this.drafts.filter(draft => draft.name === draftName)
    const member = draft.members.filter(member => member.fantasyname === FantasyName)
    draft.members.delete(member)
  }
 
  getDraftMembers(draftName) {
    const draft = this.drafts.filter(draft => draft.name === draftName)
    return draft.members
   
  }
 

  

}


class PrismaDraftStore extends draftStore {
  constructor() {
    super();
    this.prisma = prisma;
  }

  async saveDraft(draft) {
    try {
      await this.prisma.draft.upsert({
        where: { 
          name: draft.name
        }, 
        update: {
          name: draft.name,
        },
        create: {
          name: draft.name,
          League: {
            connect: {
              name: draft.name
            }
          }
        }
     })
    } catch (err) { console.log(err) 
    }
    finally {
      await this.prisma.$disconnect()
    }
    
  }

  async getDraft(draftName) {
  try{  const draft = await this.prisma.draft.findUnique({
    where: {
      name: draftName
    }
  })
    
    return draft
 }catch (err) { console.log(err) 
 }
 finally {
   await this.prisma.$disconnect()
 }
  }

  async addDraftMember(draftName, member) {
    try {
      await this.prisma.league.update(
        {
          where: {
            name: draftName
          },
          data: {
            members: {
              update: {
                where: {
                  fantasyname: member.fantasyname
                },
                data: {
                  draftName: draftName
  
                }
              }
            }
  
          }
        }
      )
 }catch (err) { console.log(err) 
 }
 finally {
   await this.prisma.$disconnect()
 }
  }


  async getDraftMembers(draftName) {
    try {
  
      const draftMembers = await this.prisma.participant.findMany({
        where: {
          draftName: draftName,
        }
      })
      return draftMembers
}

    
    catch (err) { console.log(err) 
    }
    finally {
      await this.prisma.$disconnect()
    }
  }







  async updateDraftMemberDraftOrder(draftName, FantasyName, updateValue) {
    try {
      await this.prisma.participant.update({
        where: {
          fantasyname: FantasyName
        },
        data: {
          draftOrder: updateValue
        }
      })
 }catch (err) { console.log(err) 
 }
 finally {
   await this.prisma.$disconnect()
 }


  }
  async updateDraftPick(FantasyName, updatePosition, updateValue, leagueId, choiceId, userId) {
   
    try {
      await this.prisma.wallet.update({
        where: {
          userId: userId  
        },
        data: {
          credits: {
            decrement: 500
          }

        }
      }).then(async () => { 
        await this.prisma.$disconnect()
      })
      if (updatePosition === "Bot") {
           
        await this.prisma.participant.update({
          where: {
            fantasyname: FantasyName
          },
          data: {
            adc: updateValue,
          }
        })
        await this.prisma.league.update({
          where: {
            id: leagueId
          },
          data: {
            players: {
              update: {
                where: {
                  id: choiceId
                },
                data: {
                  selected: true
                }
              }
            }
          }
        })
      }
      else if (updatePosition === "Team") {
        await this.prisma.participant.update({
          where: {
            fantasyname: FantasyName
          },
          data: {
            team: updateValue
          }
        })
        await this.prisma.league.update({
          where: {
            id: leagueId
          },
          data: {
            teams: {
              update: {
                where: {
                  id: choiceId
                },
                data: {
                  selected: true
                }
              }
            }
          }
        })
      
       }
      else {
        await this.prisma.participant.update({
          where: {
            fantasyname: FantasyName
          },
          data: {
      
            [updatePosition.toLowerCase()]: updateValue,
          }
        })
        await this.prisma.league.update({
          where: {
            id: leagueId
          },
          data: {
            players: {
              update: {
                where: {
                  id: choiceId
                },
                data: {
                  selected: true
                }
              }
            }
          }
        })
      }
}

    catch (err) { console.log(err) 
    }
    finally {
   
      await this.prisma.$disconnect()
    }


  }
  async deleteDraftMember(draftName, FantasyName) { 
    try {
      await this.prisma.participants.delete({
    where: {
      fantasyname: FantasyName, draftName: draftName
    }
  })}catch (err) { console.log(err) 
  }
  finally {
    await this.prisma.$disconnect()
  }

  } 

  async getDraftMemberWallet(userId) {
    
    try {
      const walletbalance = await this.prisma.wallet.findUnique({
        where: {
          userId: userId
        }
      })
      return walletbalance.credits
    }
    catch (err) { console.log(err) 
    }
    finally {
      await this.prisma.$disconnect()
    }
  }


}

module.exports = {
  DraftManager,
  PrismaDraftStore
}
