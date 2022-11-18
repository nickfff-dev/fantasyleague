import k from './Leagues.module.css';
import { useEffect, useState } from 'react';
import { Date } from '@customTypes/Date';
import { Fixture } from '@customTypes/Fixture';
import { Spinner } from '@components/ui';
import { Button } from '@components/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import clsx from 'clsx';
import FantasyTab from './FantasyTab';

const Leagues = () => {

  const { data: session } = useSession();
 
  const [leagues, setLeagues] = useState<any>([]);

  const getUserLeagues = async () => { 
    const res = await fetch(`/api/leagues/${session?.user?.name}`);
    const data = await res.json();
 
    setLeagues(data);
    return data;
  }

  useEffect(() => { 
getUserLeagues()
  },[session]);
 
  


  return (
    <div className={`${k.root}`}>  
      <h1 className=" text-white font-bold text-3xl uppercase">My Leagues</h1>
      <div className={`${k.root, k.resultsContainer}`}>
        
        <div className={`${k.resultsRow1}  font-semibold   mb-1`}>  <span className="text-base">FANTASYNAME</span>  <span className="text-base">REGION</span> <span className="text-base">POSITION</span> <span className="text-base">SCORE</span> <button className="invisible outline outline-[#ff921b]  rounded-xl " >View</button></div>
        {leagues.length > 0 ? leagues.map((league: any) => { 
          return league.members.map((participant: any) => { 
            return <FantasyTab league={league} participant={participant} />
          })
        }
          )
        : <Spinner />}
        </div>

    </div>
  );
};

export default Leagues;
