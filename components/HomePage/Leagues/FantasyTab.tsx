import k from './Leagues.module.css';
import { useEffect, useState } from 'react';



const FantasyTab = ({league, participant} : {league: any,  participant: any}) => { 
  return (
    <div className={`${k.container} mb-1`}>
    <div className={`${k.resultsRow} `}>
        <span className="text-base">{participant.fantasyname}</span>  <span className="text-base">{league.region}</span> <span className="text-base">{league.members.sort((a: any, b: any) => b.points - a.points).findIndex((member: any) => member.id === participant.id) + 1}</span> <span className="text-base">{participant.points}</span> <a href={` /participant/${league.name}/${participant.fantasyname}/Overview`} className="outline outline-[#ff921b] px-5 py-0.5 rounded-xl uppercase" >View</a></div></div>)

}


export default FantasyTab;
