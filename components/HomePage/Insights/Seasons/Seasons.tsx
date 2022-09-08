import { useEffect, useState } from 'react';
import { Date } from '@customTypes/Date';


import s from './Seasons.module.css';
import { Spinner } from '@components/ui';

const Seasons = () => {
  const [dates, setDates] = useState<Date[]>();


  useEffect(() => {
    fetch('/api/dates')
      .then((res) => res.json())
      .then((dates) => setDates(dates));
  }, []);



  return (
    <div className={s.root}>
      <h1>Seasons</h1>

      <div className={s.container}>
        {!dates && <Spinner className='w-6' />}

        {dates?.map((date) => (
          <h1 key={date.name}>
            <span>{date.name}</span> | {date.date}
          </h1>
        ))}

       
      </div>
    </div>
  );
};

export default Seasons;
