import s from './Info.module.css';

const Info = () => {
  return (
    <div className={s.root}>
      <h1>Info</h1>
      <div className={s.container}>
        <div>
          <h1>Rules</h1>
          <p>
            Find an in-depth list here of how all the points are calculated and how any exception to normal game circumstances are
            handled.
          </p>
        </div>

        <div>
          <h1>FAQ</h1>
          <p>
            Find an in-depth list here of how all the points are calculated and how any exception to normal game circumstances are
            handled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
