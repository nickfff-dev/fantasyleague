import k from './Leagues.module.css';
import { useEffect, useState } from 'react';
import ResultDetail from '@components/PlayerResult/ResultDetail';




const FantasyTab = ({ league, participant }: { league: any, participant: any }) => { 
  const [showModal, setShowModal] = useState(false)
  const [results, setResults] = useState<any>([])
  const closeModal = () => {
    setShowModal(false)
  }
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

      
  },[])
  return (
   <> <div className={`${k.container} mb-1`}>
    <div className={`${k.resultsRow} `}>
        <span className="text-base">{participant.fantasyname}</span>  <span className="text-base">{league.region}</span> <span className="text-base">{league.members.sort((a: any, b: any) => b.points - a.points).findIndex((member: any) => member.id === participant.id) + 1}</span> <span className="text-base">{participant.points}</span> <button onClick={() => {
          setShowModal(!showModal)
        }} className="outline outline-[#ff921b] px-5 py-0.5 rounded-xl uppercase" >View</button></div></div>
    
    {
        showModal ? (  results &&               <ResultDetail league={league} participant={participant} results={results} closeModal={ closeModal} />) : null
      }
    </>)

}


export default FantasyTab;
