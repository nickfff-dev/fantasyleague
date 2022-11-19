import k from './Leagues.module.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';


const OpenLeagues = ({ league, prize }: { league: any, prize: any }) => { 

  return (
    <div className={`${k.container} mb-1`}>
    <div className={`${k.resultsRow} `}>
        <span className="text-base">${Intl.NumberFormat('en-US').format(prize)}</span>  <span className="text-base">{league.region}</span> <span className="text-base">${Intl.NumberFormat('en-US').format(league.buyInFee)}</span> <span className="text-base">{Math.ceil(league.duration / 7) + ' weeks'}</span> <a href={`/league-summary/${league.name}/`} className="outline outline-[#ff921b] px-5 py-0.5 rounded-xl uppercase" >View</a></div></div>)

}


export default OpenLeagues;
