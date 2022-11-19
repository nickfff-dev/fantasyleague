import k from './Leagues.module.css';
import { useEffect, useState } from 'react';



const OpenLeagues = ({ league }: { league: any }) => { 
  return (
    <div className={`${k.container} mb-1`}>
    <div className={`${k.resultsRow} `}>
        <span className="text-base">{league.name}</span>  <span className="text-base">{league.region}</span> <span className="text-base">{league.buyInFee}</span> <span className="text-base">{league.points}</span> <a href={` /league-summary/${league.name}/`} className="outline outline-[#ff921b] px-5 py-0.5 rounded-xl uppercase" >View</a></div></div>)

}


export default OpenLeagues;
