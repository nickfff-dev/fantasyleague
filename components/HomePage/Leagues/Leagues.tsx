import s from '../Insights/Seasons/Seasons.module.css';
import { useEffect, useState } from 'react';
import { Date } from '@customTypes/Date';
import { Fixture } from '@customTypes/Fixture';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';


const Leagues = () => {
 
  


  return (
    <div >  
      <h1 className=" text-white font-semibold text-4xl uppercase">My Leagues</h1>
      <div className={`${s.root} grid-flow-col auto-cols-max`}>
        <div className="flex flex-row justify-evenly text-white  "> <h1>GROUP</h1> <h1>STANDINGS</h1><h1>REGION</h1><h1>SCORE</h1><h1></h1></div>
        <div className={`${s.container}`}>
          <div className="flex flex-row justify-between w-full text-white text-center">
           <span>FANTASYNAME</span>  <span>REGION</span> <span>POSITION</span> <span>SCORE</span> <button className="outline outline-[#ff921b] px-6 rounded-xl " ><h1 className="rounded-lg uppercase ">View</h1></button></div>
        </div>
        </div>

    </div>
  );
};

export default Leagues;
