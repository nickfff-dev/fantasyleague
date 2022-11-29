import L from './Leaguesummary.module.css';
import { useState, useEffect } from 'react'
import ResultDetail from '@components/PlayerResult/ResultDetail';



const TeamTab = ({ league, participant, wallets, position }: { league: any, participant: any, wallets: any, position: any }) => { 
 const [showModal, setShowModal] = useState(false)
 const [results, setResults] = useState<any>([])
  const getResults =  () => {
    try {     const mavitu =  fetch(`http://localhost:3000/api/populate-fantasy/${league.name}/`, {
      method: 'POST',
      body: JSON.stringify({
        fantasyname: participant.fantasyname,
      }),
    }).then((res) =>
      res.json().then((data) => { 
        return JSON.parse(data)
      }))
    
      return mavitu
    } catch (e: any) {
  console.log(e)
}
  }
  const updateData = () => {
    getResults()?.then((data) => {
      setResults(data)
    })
  }

  useEffect(() => {
    updateData()
console.log(results)
      
  },[results])
  return (
    <>
        <div className={`${L.container} mb-1`}>
    <div className={`${L.resultsRow}`}>
        <span className="text-sm">{position}</span>  <span className="text-sm">{participant.fantasyname}</span> <span className="text-sm">{participant.points}</span> <span className="text-sm">${wallets.filter((wallet:any) => wallet.userId === participant.userId).map((wallet:any) => Intl.NumberFormat('en-US').format(wallet.credits))
        }</span> <button onClick={() => {
          setShowModal(!showModal)
          }} className="outline outline-[#ff921b] px-3 text-sm py-0.5 rounded-xl uppercase" >View</button></div></div>
      
      {
        showModal ? (<ResultDetail league={league} participant={participant} results={ results} />) : null
      }
    </>
  
  )

}


export default TeamTab;
