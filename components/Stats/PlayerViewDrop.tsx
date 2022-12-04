

import { useState, useEffect } from 'react';
import Lt from "./stats2.module.css"
const PlayerViewDrop = ({data, }: {data:any}) => { 
  const [show1, setShow1] = useState(false)
  const [split,setSplit] = useState(data[0].split)

  const showDropwdwn = () => { 
    setShow1(!show1)
  }
  const filterByGame = (split: any) => { 
    setSplit(split)
  }
  return (
    <div className={`${Lt.team} grid text-center grid-flow-col justify-items-center content-center auto-cols-[70px]  overflow-x-scroll overflow-y-hidden w-[900px] `}>
          <span className="">
    <button id="dropdownDividerButton" onClick={ showDropwdwn } data-dropdown-toggle="dropdownDivider1" className=" rounded-lg text-sm  text-center text-white pl-3 inline-flex items-center font-bold uppercase" type="button"> <span  className=" text-[10px]" >Select</span><svg className="w-2 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
    <div id="dropdownDivider1" className={`${show1 ? "z-40" : "hidden"} h-32 mb-12  absolute  overflow-y-scroll overflow-x-hidden ml-2 w-40  text-center bg-white max-w-40  rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
    <ul className="py-1 text-sm text-gray-700 " aria-labelledby="dropdownDividerButton">

          {
            data.map((item: any, index: number) => { 
              return (
                <li key={index} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <button onClick={() => {
                    filterByGame(item.split);
                    setShow1(false)
                  }} className="inline py-2 px-4 text-center text-[10px] uppercase">{item.split}</button>
                </li>
              )
          
            })
    }
</ul>
      </div>
             
      </span>
      
      {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.kills}</span>
            
            
          
          )
         })
      }
            {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.deaths}</span>
            
            
          
          )
         })
      }
               {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.assists}</span>
            
            
          
          )
         })
      }
                 {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.cs}</span>
            
            
          
          )
         })
      }
                     {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.teamTotal}</span>
            
            
          
          )
         })
      }
                        {
        data.filter((item: any) => item.split === split).slice(0,1).map((entry: any) => {  
          return (
            
            <span>{entry.vs}</span>
            
            
          
          )
         })
      }
</div>
  )
}

export default PlayerViewDrop
