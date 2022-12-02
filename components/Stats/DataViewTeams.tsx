import St from "./stats.module.css";



const DataViewTeams = ({ stats, mode }: { stats: any, mode:any }) => {
  return (
    <div className={`${St.data}`}>
    <div className={`${St.dataleftcontainer}`}>
      <div className={`${St.dataleft} text-white font-bold text-base`}>
    <span>NAME</span>
      <span>REGION</span>
     
      <span>PRICE</span>
    
      </div>
       
      {
        stats.map((stat: any, index:number) => { 
          return (
            <div key={index} className={`${St.dataleft} text-white`} >
              <span>{stat.key.split(" ")[0]}</span>
              <span>{stat?.value[0]?.region}</span>
              <span>$50,000</span>
            </div>
          )
        })
      }

    </div>
    {
      mode === "scores" ? (      <div id="games" className={`${St.datarightcontainer} relative`}>
      <button id="scroller" >     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-8 h-5 rounded-full   fixed border  right-[50px]">
<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg></button>

      <div  className={`${St.dataright} text-white text-base font-bold font-dubai`}>

          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((item: any, index: number) => {
              return (
                <span key={index}>GAME{item }</span>
              )
            })
    
    
          }
      </div>
      
      {
        stats.map((stat: any, index: number) => { 
          return (
            <div key={index} className={`${St.dataright} text-white`}>
              {
                stat.value.map((entry: any) => {
                  return(<span>{ entry.points}</span>)
                })
              }
  </div>
          )
        })
     }
    </div>): (      <div id="games" className={`${St.datarightcontainer} relative`}>
      <button id="scroller" >     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-8 h-5 rounded-full   fixed border  right-[50px]">
<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg></button>

      <div  className={`${St.dataright} text-white font-bold font-dubai`}>

      <span className=" text-[10px]">TOWERS</span>
      <span className=" text-[10px]">INHIBITORS</span>
      <span className=" text-[10px]">DRAGONS</span>
      <span className=" text-[10px]">RIFTHERALDS</span>
      <span className=" text-[10px]">BARONS</span>
              <span className=" text-[10px]">TOTALKILLS</span>
              
              
    
    
      </div>
      
      {
        stats.map((stat: any, index: number) => { 
          return (
            <div key={index} className={`${St.dataright} text-white`}>
              {/* reduce kills deaths assists cs vs teamtotal from stat.value and render each in a span */}
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.towers, 0)}</span>
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.inhibitors, 0)}</span>
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.dragons, 0)}</span>
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.rift, 0)}</span>
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.baron, 0)}</span>
              <span>{stat.value.reduce((acc: any, curr: any) => acc + curr.totalKill, 0)}</span>
             
  </div>
          )
        })
     }
    </div>)
}
  </div>
  )
}


export default DataViewTeams
