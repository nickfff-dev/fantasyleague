import k from './Leagues.module.css';
import { useEffect, useState } from 'react';
import { Date } from '@customTypes/Date';
import { Fixture } from '@customTypes/Fixture';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import clsx from 'clsx';
import Trades from './Trades';

const TradesGroup = () => {

  const { data: session } = useSession();
 
  const [trades, setTrades] = useState<any>([]);

  const getUserLeagues = async () => { 
    const res = await fetch(`/api/leagues/${session?.user?.name}`);
    const data = await res.json();
 
    setTrades(data);
    return data;
  }

  useEffect(() => { 
getUserLeagues()
  },[session]);
 
  


  return (
    <div className={`${k.root}`}>  
      <h1 className=" font-bold text-3xl uppercase">My Leagues</h1>
      <div className={`${k.root, k.resultsContainer} h-[300px] overflow-y-scroll`}>
        
        <div className={`${k.resultsRow1}  font-semibold`}>  <span className="text-base">FANTASYNAME</span>  <span className="text-base">REGION</span> <span className="text-base">POSITION</span> <span className="text-base">SCORE</span> <button className="invisible outline outline-[#ff921b]  rounded-xl " >View</button></div>
        {trades.map((trade: any) => { 
         
            return <Trades trade={trade} />
          })
        }
          )
        
        </div>

    </div>
  );
};

export default TradesGroup;
