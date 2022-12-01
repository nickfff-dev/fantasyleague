import { useState, useEffect } from 'react';
 import St from "./stats.module.css";



const Stats = ({ statistics }: { statistics: any }) => {
  const [show, setShow] = useState(false)
  const showDropwdwn = () => {
    setShow(!show)
     
   }       
  const [role, setRole] = useState("")
  const [region, setRegion] = useState("")
  const [view, setView] = useState("Players")
  const [season,setSeason] = useState("2022  Summer Season")
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
  const runFilter = () => {
    const unfilt = filterdata()
    const empunfilt: any[] =[]
    unfilt.map((play: any) => {
      if (play.region === region && play.role === role) {
        empunfilt.push(play)
    }
    })
    
    const tuma = Object.entries(groupBy(empunfilt, "name")).map(([key, value]) => ({ key, value }))

setStats(tuma)

  }



  
  useEffect(() => {
    if (role !== "" || region !== "") {
      runFilter()
    }
  },[role, region])


  return (<div className={`${St.root}`}>
    <div className={`${St.datafilters}`}>
      <div className={`${St.datafiltersleft}`}>
        <button>SCORE</button>
        <button>STATS</button>
      </div>
      <div className={`${St.datafiltersright}`}>
        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider" className="   font-medium rounded-lg text-sm  text-center inline-flex items-center uppercase" type="button">View : <span >{view}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider" className={`${show ? "z-20" : "hidden"} absolute z-20  mt-2 max-w-44 bg-primary rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
          <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDividerButton">
              <li> <button onClick={() => { setView("Players"); setShow(false)}}
                  className="inline py-2 px-4 ">players</button>
                </li>
            <li>
                <button onClick={() => {
                  setView("Teams"); setShow(false);
                  
 }}
                  className="inline py-2 px-4 ">teams</button>
                </li> 
            )
    </ul>
</div></span>
        <span>SPLIT:{season}</span>

        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider2" className="   font-medium rounded-lg text-sm  text-center inline-flex items-center uppercase" type="button">Region : <span >{region}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider2" className={`${show ? "z-20" : "hidden"} absolute z-20  mt-2 max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
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
            )
    </ul>
</div></span>
        <span>
          <button id="dropdownDividerButton" onClick={showDropwdwn} data-dropdown-toggle="dropdownDivider" className="   font-medium rounded-lg text-sm  text-center inline-flex items-center uppercase" type="button">Role : <span >{role}</span><svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div id="dropdownDivider" className={`${show ? "z-20" : "hidden"} absolute z-20  mt-2 max-w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
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
            )
    </ul>
</div></span>
      <input type="text" placeholder="Search" />
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
                <span>{stat.key}</span>
                <span>{stat?.value[0]?.region}</span>
                <span>{stat.value[0].team}</span>
                <span>{stat.value[0].role}</span>
                <span>50,000</span>
              </div>
            )
          })
        }

      </div>
      <div className={`${St.datarightcontainer}`}>
        <div className={`${St.dataright}`}>

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

