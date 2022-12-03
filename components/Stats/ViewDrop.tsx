import { useState, useEffect } from 'react';
import St from "./stats.module.css";
const ViewDrop = ({data, }: {data:any}) => { 
  const [show1, setShow1] = useState(false)
  const [split,setSplit] = useState(data[0].split)

  const showDropwdwn = () => { 
    setShow1(!show1)
  }
  const filterByGame = (split: any) => { 
    setSplit(split)
  }
  return (
    <div className={`${St.dataright} text-white`}>
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
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.towers}</span>
            
            
          
          )
         })
      }
            {
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.inhibitors}</span>
            
            
          
          )
         })
      }
               {
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.dragons}</span>
            
            
          
          )
         })
      }
                 {
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.rift}</span>
            
            
          
          )
         })
      }
                     {
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.baron}</span>
            
            
          
          )
         })
      }
                        {
        data.filter((item: any) => item.split === split).map((entry: any) => {  
          return (
            
            <span>{entry.totalKill}</span>
            
            
          
          )
         })
      }
</div>
  )
}

export default ViewDrop
