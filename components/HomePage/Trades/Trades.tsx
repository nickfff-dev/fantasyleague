import k from './Leagues.module.css';
import { useEffect, useState } from 'react';



const Trades = ({trade} : {trade: any}) => { 
  return (
    <div className={`${k.container} mb-1`}>
    <div className={`${k.resultsRow} `}>
        <span className="text-base">{trade.fantasyname}</span>  <span className="text-base">{trade.region}</span> <span className="text-base">{}</span> <span className="text-base">{trade.points}</span> </div></div>)

}


export default Trades;
