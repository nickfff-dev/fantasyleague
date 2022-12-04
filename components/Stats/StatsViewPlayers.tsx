import { useEffect, useState } from 'react';

import Lt from "./stats2.module.css"
import PlayerViewDrop from "./PlayerViewDrop"
const StatsViewPlayers = ({stats, mode}:{stats:any, mode:any}) => { 
  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
        
      const mav = document.querySelectorAll(`.${Lt.team}`)
      
      mav.forEach((item) => { 
        item.scrollBy(10, 0)
      })
    })
  })
  useEffect(() => {
    document.getElementById("scrollerback")?.addEventListener("click", () => {
        
      const mav = document.querySelectorAll(`.${Lt.team}`)
      
      mav.forEach((item) => { 
        item.scrollBy(-10, 0)
      })
    })
   })
  return (<>
    <div className={`${Lt.root} mt-12`}>
    <div id="freed" className="grid [&>*:nth-child(odd):not(:first-child)]:bg-gray-medium [&>*:nth-child(even)]:bg-gray-light  grid-flow-rows auto-rows-[50px] space-y-2 content-center justify-items-center">
      
      
      <div className=" grid grid-cols-1 justify-items-center content-center items-center my-auto">
          {
            mode === "scores" ? (        <div className="flex flex-row">
            <button id="scroller" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-6 h-5 rounded-full   fixed border  top-70 right-[50px]">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg></button>
          
            <button id="scrollerback" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-6 h-5 rounded-full rotate-180  fixed border  top-70 right-[80px]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
  </svg>
            </button>
          </div>  ) : null
}
        <div className="grid grid-flow-col max-w-[86vw] w-[86vw] mx-auto  auto-cols-[95px] text-center text-white font-bold">
          <p>NAME</p>
        <p >REGION</p>
        <p>TEAM</p>
        <p>ROLE</p>
          <p >PRICE</p>
          <p className="invisible" >|</p>
         
        
          
            {
              mode === "scores" ? (  <div  className={`${Lt.team}  grid text-center grid-flow-col justify-items-center content-center auto-cols-[70px] overflow-x-scroll overflow-y-hidden w-[700px]`}>
            
              <p>GAME1</p>
              <p>GAME2</p>
              <p>GAME3</p>
              <p>GAME4</p>
              <p>GAME5</p>
              <p>GAME6</p>
              <p>GAME7</p>
              <p>GAME8</p>
              <p>GAME9</p>
              <p>GAME10</p>
              <p>GAME11</p>
              <p>GAME12</p>
              <p>GAME13</p>
              <p>GAME14</p>
              <p>GAME15</p>
              <p>GAME16</p>
              <p>GAME17</p>
              <p>GAME18</p>
              <p>GAME19</p>
              <p>GAME20</p>
              <p>GAME21</p>
              <p>GAME22</p>
              <p>GAME23</p>
  
            </div>):(  <div  className={`${Lt.team} grid text-center grid-flow-col justify-items-center content-center auto-cols-[70px] overflow-x-scroll  w-[700px]`}>
            <span>GAME</span>
            <span>KILLS</span>
      <p>DEATHS</p>
      <p>ASSISTS</p>
      <p>CS</p>
      <p>KILL%</p>
      <p>VISION</p>
          </div>)
        }
      </div>
      </div>
        {stats.map((stat: any, index: number) => { 
          return (
            <div className=" grid grid-cols-2  items-center my-auto rounded-full text-white">
            <div className="grid grid-flow-col auto-cols-[95px] text-center ">
            <p>{stat.key.split(" ")[0]}</p>
              <p>{stat?.value[0]?.region}</p>
              <p>{stat.value[0].team}</p>
              <p>{stat.value[0].role}</p>
              <p>$50,000</p>
              <p >|</p>
              
                {
                  mode=== "scores" ? (    <div   className={`${Lt.team}  grid grid-flow-col content-center justify-items-center  auto-cols-[70px] overflow-x-scroll  w-[700px]`}>
                
                  {
                    stat.value.map((entry: any, index:number) => {
                      return(<p key={index}>{ entry.points}</p>)
                    })
                  }
        
                  </div>): (    <PlayerViewDrop data={stat.value} />)
          }
          </div>
          </div>
          )
        })}

  
    </div>
      </div>
    </>
  )
}


export default StatsViewPlayers
