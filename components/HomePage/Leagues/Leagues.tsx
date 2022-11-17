import k from './Leagues.module.css';
import { useEffect, useState } from 'react';
import { Date } from '@customTypes/Date';
import { Fixture } from '@customTypes/Fixture';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';


const Leagues = () => {
 
  


  return (
    <div className={`${k.root}`}>  
      <h1 className=" text-white font-bold text-3xl uppercase">My Leagues</h1>
      <div className={`${k.root, k.resultsContainer}`}>
        
        <div className={`${k.resultsRow1}  font-semibold   mb-1`}>  <span className="text-base">FANTASYNAME</span>  <span className="text-base">REGION</span> <span className="text-base">POSITION</span> <span className="text-base">SCORE</span> <button className="invisible outline outline-[#ff921b]  rounded-xl " >View</button></div>
        <div className={`${k.container} mb-1`}>
          <div className={`${k.resultsRow} `}>
           <span className="text-base">THEBESTLEAGUE</span>  <span className="text-base">LCK</span> <span className="text-base">1</span> <span className="text-base">456</span> <button className="outline outline-[#ff921b] w-12  rounded-xl  " >View</button></div>
        </div>
        </div>

    </div>
  );
};

export default Leagues;
