import DemoChallenge from '../components/DemoChallenge';
import './styles/homepage.css';

const HomePage = () => (
  <>
    <section className="home">
      <header className="home__header">
        <h1 className="home__heading">
          <span className="home__heading--top">Code Together</span>
          Conquer Challenges
        </h1>

        <p className="home__description">
          Improve your coding skills by pairing up with other coders to tackle
          coding challenges.
        </p>

        <div className="home__action">
          <a className="transition-colors home__link" href="/challenges">
            Get Started
          </a>
        </div>
      </header>
    </section>

    <div className="home-content">
      <svg
        className="home-blob"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          // fill="#FF0066"
          d="M21.5,-46C27.9,-33.5,33.3,-27.9,41.6,-21.4C49.8,-14.9,60.9,-7.5,65.9,2.9C71,13.3,70,26.5,62.6,34.6C55.3,42.7,41.6,45.5,30.1,47.5C18.6,49.4,9.3,50.3,-0.3,50.9C-10,51.4,-19.9,51.6,-25.8,46.4C-31.6,41.3,-33.3,30.8,-35.1,22.1C-36.9,13.5,-38.7,6.8,-40.2,-0.9C-41.7,-8.5,-42.9,-17,-44.2,-30.8C-45.4,-44.6,-46.6,-63.7,-39.3,-75.7C-31.9,-87.7,-15.9,-92.6,-4.2,-85.3C7.5,-78,15,-58.5,21.5,-46Z"
        />
      </svg>

      <section className="info">
        <header className="info__header">
          <h3 className="info__heading">Features</h3>
        </header>

        <div className="info__tile">
          <h4 className="info__subheading">Upgrade your skills</h4>
          <div className="info__text">
            Challenge your coding skills on various of challenges across
            multiple langauges.
          </div>
        </div>

        <div className="info__tile">
          <h4 className="info__subheading">Learn from others</h4>
          <div className="info__text">
            Take on challenges in pair programming mode, where you work with
            another programmer to complete challenges.
          </div>
        </div>

        <div className="info__tile">
          <h4 className="info__subheading">Complete with peers</h4>
          <div className="info__text">
            Completing challenges allows you to find moviation by competing
            against friends or the entire community.
          </div>
        </div>
      </section>
    </div>

    <section className="demo">
      <div className="demo__wrapper">
        <header className="demo__header">
          <h3 className="demo__heading">Demo</h3>
        </header>

        <DemoChallenge />
      </div>
    </section>

    <section className="footer">© {new Date().getFullYear()} CodePair</section>
  </>
);

export default HomePage;
