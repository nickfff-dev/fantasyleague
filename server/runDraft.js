






function initializeTeamPickArray() {
  var numberofteams = 3
var numberofrounds = 6
var numberofpicks = numberofteams * numberofrounds
var numberofpicksperround = 1

var teamPickArray = []

  for (var i = 0; i < numberofrounds; i++) {
    if (i % 2 == 0) {
      for (var j = 0; j < numberofteams; j++) {
        teamPickArray.push(j)

      }
    } else {
      for (var x = numberofteams - 1; x >= 0; x--) {
        teamPickArray.push(x)
      }
    }
  
  }
  

  var rounds = 6
  var roundArray = []
  var roundArrayIndex = 0
  for (var y = 0; y < rounds; y++) {
    roundArray.push(teamPickArray.slice(roundArrayIndex, roundArrayIndex + numberofteams))
    roundArrayIndex += numberofteams
  }
  const topRound = roundArray[0]
  const jungleRound = roundArray[1]
  const midRound = roundArray[2]
  const adcRound = roundArray[3]
  const supportRound = roundArray[4]
  const teamRound = roundArray[5]

  return [topRound, jungleRound, midRound, adcRound, supportRound, teamRound]
 
}

  


// function sendDraftRounds() {
  
//   // const draftMembers = [{fantasyname: "juma", draftOrder: 0},{fantasyname: "tuma", draftOrder:1},{fantasyname: "wuma", draftOrder: 2}]
//   const roundArray = initializeTeamPickArray()

//   const topRound = roundArray[0]
//   const jungleRound = roundArray[1]
//   const midRound = roundArray[2]
//   const adcRound = roundArray[3]
//   const supportRound = roundArray[4]
//   const teamRound = roundArray[5]

//   return [topRound, jungleRound, midRound, adcRound, supportRound, teamRound]
// }




// const startTopRound = () => {
  
// for (var i = 0; i < draftMembers.length; i++){
//   (
//     function (i) {
//       topRound.forEach((topPick) => {
//         if (draftMembers[i].draftOrder == topPick) {
//           setTimeout(function () {
//             console.log(draftMembers[i].fantasyname + " top" + " " + topPick)
          
//            }, i*5000)
//         }
//       })
//     }
//   ) (i)
// }
// }








