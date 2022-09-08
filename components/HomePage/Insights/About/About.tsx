import s from './About.module.css';

const About = () => {
  return (
    <div className={s.root}>
      <h1>About</h1>

      <div className={s.container}>
        <div>
          <h1>Draft Your Team</h1>
          <p>The pick and ban systems balances gameplay so that skill is the deciding factor, not luck.</p>
        </div>

        <div>
          <h1>Score Points and Win</h1>
          <p>
            Watch games live or let your points roll in AFK. Your players will score more points depending on how well they play.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
