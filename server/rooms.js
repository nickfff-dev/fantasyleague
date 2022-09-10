const prisma = require('prisma').prisma



const leagues = prisma.leagues.findMany({})
let rooms  = []

leagues.forEach(league => { 
  rooms.push(league.name)
})


module.exports = {
  rooms
}
