import { useState, useEffect } from 'react';
 import St from "./stats.module.css";



const Stats = ({ statistics }: { statistics: any }) => {

  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
     document.getElementById("games")?.scrollBy(10,0)
   })
 })
  const [show, setShow] = useState(false)
  const showDropwdwn = () => {
    setShow(!show)
     
   }       
  const [role, setRole] = useState("")
  const [region, setRegion] = useState("")
  const [view, setView] = useState("Players")
  const [season,setSeason] = useState(" Summer Season")
  var groupBy = function(xs:any, key:any) {
    return xs.reduce(function(rv:any, x:any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };





  const filterdata = () => {
    var playerstats: { leaguname : any, name: any; region: any; team: any; role: any; split: any; points: any[]; }[] = []
    statistics.map((league: any) => {
    
        league.PlayerResult.map((result: any) => {
       
            playerstats.push({
              leaguname:league.name,
              name: result.name,
              region: league.region,
              team: result.team,
              role: result.role,
              split: result.game,
              points: result.points
            })
            
          
          
        })
      
      
    })

    
   
    return playerstats
  }


  
  const assignData = () => {
    const mres = filterdata()
    const tuma = Object.entries(groupBy(mres, "name")).map(([key, value]) => ({ key, value }))
    return tuma
  }
  const [stats, setStats] = useState(assignData())
  const runFilter = (region:string, role:string) => {
    const unfilt = filterdata()
    const empunfilt: any[] =[]
    if (region !== "" && role !== "") {
      unfilt.map((play: any) => {
        if (play.region === region && play.role === role) {
          empunfilt.push(play)
      }
      })
    } else if (region !== "" && role === "") {
      unfilt.map((play: any) => {
        if (play.region === region) {
          empunfilt.push(play)
      }
      })
    } else if (region === "" && role !== "") {
      unfilt.map((play: any) => {
        if (play.role === role) {
          empunfilt.push(play)
      }
      })
    }
    
    const tuma = Object.entries(groupBy(empunfilt, "name")).map(([key, value]) => ({ key, value }))

setStats(tuma)

  }



  
  useEffect(() => {
    if ( region !== "" || role !== "") {
      runFilter(region, role)
    }
  }, [ region, role])
  


  return (<div className={`${St.root}`}>
    <div className={`${St.datafilters}`}>
      <div className={`${St.datafiltersleft}`}>
        <button className={`${St.scorefilter}`}><span>SCORE</span></button>
        <button className={`${St.statsfilter}`}><span>STATS</span></button>
      </div>
      <div className={`${St.datafiltersright}`}>
        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider" className="   font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">View : <span className={`${St.filtnam} pl-2`}>{view}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider" className={`${show ? "z-20" : "hidden"} absolute z-20 w-32 ml-2 text-center bg-white max-w-40  rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
          <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              <li> <button onClick={() => { setView("Players"); setShow(false)}}
                  className="inline py-2 px-4 uppercase">players</button>
                </li>
            <li>
                <button onClick={() => {
                  setView("Teams"); setShow(false);
                  
 }}
                  className="inline py-2 px-4 uppercase ">teams</button>
                </li> 
            
    </ul>
</div></span>
        

        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider2" className="font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">SPLIT : <span className={`${St.filtnam} pl-2`}>2022{season}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider2" className={`${show ? "z-20" : "hidden"} absolute z-20 ml-20 w-40 mt-2 text-center max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
          <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">

            <li>
                <button onClick={() => {
           setSeason(" SUMMER SEASON"); setShow(false)}}
                  className="inline py-2 px-4 ">SUMMER SEASON</button>
              </li> 
              <li>
                <button onClick={() => {
                  setSeason(" SPRING SEASON"); setShow(false)}}
                  className="inline py-2 px-4 ">SPRING SEASON</button>
              </li>
      
            
    </ul>
</div></span>

        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider2" className="font-medium rounded-lg text-sm  text-center text-white text-lg inline-flex items-center font-bold uppercase" type="button">Region : <span className={`${St.filtnam} pl-2`}>{region}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider2" className={`${show ? "z-20" : "hidden"} absolute z-20   ml-8 w-24 max-w-24 text-center bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
          <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">

            <li>
                <button onClick={() => {
           setRegion("LCS"); setShow(false)}}
                  className="inline py-2 px-4 ">LCS</button>
              </li> 
              <li>
                <button onClick={() => {
                  setRegion("LEC"); setShow(false)}}
                  className="inline py-2 px-4 ">LEC</button>
              </li>
              <li>
                <button onClick={() => {
                 setRegion("LCK"); setShow(false)}}
                  className="inline py-2 px-4 ">LCK</button>
              </li>
              <li>
                <button onClick={() => {
                  setRegion("LPL"); setShow(false)}}
                  className="inline py-2 px-4 ">LPL</button>
                </li>
            
    </ul>
</div></span>
        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider" className="   font-medium rounded-lg text-sm  text-center inline-flex items-center text-white text-lg font-bold uppercase" type="button">Role : <span className={`${St.filtnam} pl-2`} >{role}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider" className={`${show ? "z-20" : "hidden"} absolute z-20   w-24 ml-12 text-center max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
          <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              <li> <button onClick={() => {  setRole("Top");; setShow(false); }}
                  className="inline py-2 px-4 ">Top</button>
                </li>
            <li>
                <button onClick={() => {
                  setRole("Mid"); setShow(false);

                }}
                  className="inline py-2 px-4 ">Mid</button>
              </li> 
              <li>
                <button onClick={() => {
                   setRole("Jungle");; setShow(false);
                  }}
                  className="inline py-2 px-4 ">Jungle</button>
              </li>
              <li>
                <button onClick={() => {
                  setRole("Support"); setShow(false);
                  }}
                  className="inline py-2 px-4 ">Support</button>
              </li>
              <li>
                <button onClick={() => {
                setRole("Bot"); setShow(false);
                  }}
                  className="inline py-2 px-4 ">Bot</button>
                </li>
            
    </ul>
</div></span>
      <input type="text" placeholder="Search Here..." className={`${St.searchbar}`} />
      </div>
    </div>
    <div className={`${St.data}`}>
      <div className={`${St.dataleftcontainer}`}>
        <div className={`${St.dataleft}`}>
      <span>NAME</span>
        <span>REGION</span>
        <span>TEAM</span>
        <span>ROLE</span>
        <span>PRICE</span>
      
        </div>
         
        {
          stats.map((stat: any, index:number) => { 
            return (
              <div key={index} className={`${St.dataleft}`} >
                <span>{stat.key.split(" ")[0]}</span>
                <span>{stat?.value[0]?.region}</span>
                <span>{stat.value[0].team}</span>
                <span>{stat.value[0].role}</span>
                <span>50,000</span>
              </div>
            )
          })
        }

      </div>
      <div id="games" className={`${St.datarightcontainer} relative`}>
        <button id="scroller" >     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-8 h-5 rounded-full   fixed border  right-[50px]">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg></button>

        <div  className={`${St.dataright}`}>

        <span>GAME1</span>
        <span>GAME2</span>
        <span>GAME3</span>
        <span>GAME4</span>
        <span>GAME5</span>
        <span>GAME6</span>
        <span>GAME7</span>
        <span>GAME8</span>
        <span>GAME9</span>
        <span>GAME10</span>
        <span>GAME11</span>
          <span>GAME12</span>
          <span>GAME13</span>
          <span>GAME14</span>
          <span>GAME12</span>
          <span>GAME13</span>
          <span>GAME14</span>
          <span>GAME15</span>
          <span>GAME16</span>
        <span>GAME17</span>
      
      
      
        </div>
        
        {
          stats.map((stat: any, index: number) => { 
            return (
              <div key={index} className={`${St.dataright}`}>
                {
                  stat.value.map((entry: any) => {
                    return(<span>{ entry.points}</span>)
                  })
                }
    </div>
            )
          })
       }
      </div>
    </div>
   
  </div>)
 }


 export default Stats

