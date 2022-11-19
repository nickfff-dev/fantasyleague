import L from './Leaguesummary.module.css';




const TeamTab = ({ league, participant, wallets, position }: { league: any, participant: any, wallets: any, position: any }) => { 
 
  return (
    <div className={`${L.container} mb-1`}>
    <div className={`${L.resultsRow}`}>
        <span className="text-sm">{position}</span>  <span className="text-sm">{participant.username}</span> <span className="text-sm">{participant.points}</span> <span className="text-sm">{wallets.filter((wallet:any) => wallet.userId === participant.userId).map((wallet:any) => wallet.credits)
        }</span> <a href={`/participant/${league.name}/${participant.fantasyname}/Overview`} className="outline outline-[#ff921b] px-3 text-sm py-0.5 rounded-xl uppercase" >View</a></div></div>)

}


export default TeamTab;
