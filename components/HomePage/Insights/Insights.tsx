import About from './About/About';
import Info from './Info/Info';
import s from './Insights.module.css';
import Seasons from './Seasons/Seasons';

const Insights = () => {
  return (
    <div className={s.root}>
      <h1>How to play</h1>

      <About />
      <Seasons />
      <Info />
    </div>
  );
};

export default Insights;
