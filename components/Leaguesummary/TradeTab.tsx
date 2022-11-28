import L from './Leaguesummary.module.css';
import { useEffect, useState } from 'react';



const TradeTab= ({trade, owner} : {trade: any, owner:string}) => { 
  return (
    <div className={`${L.container} mb-1`}>
    <div className={`${L.resultsRow} `}>
        <span className="text-sm">{trade.playerOut}</span>  <span className="text-sm">{trade.playerIn}</span> <span className="text-sm">${Intl.NumberFormat('en-US').format(10000)}</span> <span className="text-sm">$500,000</span><span className="text-sm">{owner}</span> </div></div>)

}


export default TradeTab
