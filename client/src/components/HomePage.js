import * as React from 'react';
import './styles/homepage.css';

const HomePage = () => (
  <>
    <section className="home">
      <header className="home__header max-wrapper">
        <h1 className="home__heading">Pair program through challenges</h1>
        <p className="home__content">
          Pair up with other coders or a friend to complete challenges.
        </p>
      </header>
    </section>

    <section className="language max-wrapper">
      <h4 className="langauge__heading">Supported Langauage</h4>
      <div className="langauge__content">
        <ul className="langauge__list">
          <li className="language__item">
            <i className="devicon-javascript-plain language__icon">
              <div className="language__tooltip">Javascript</div>
            </i>
          </li>

          <li className="language__item">
            <i className="devicon-cplusplus-line language__icon language__icon--soon">
              <div className="language__tooltip">Coming Soon</div>
            </i>
          </li>

          <li className="language__item">
            <i className="devicon-python-plain language__icon language__icon--soon">
              <div className="language__tooltip">Coming Soon</div>
            </i>
          </li>
        </ul>
      </div>
    </section>

    <section className="info">
      <div className="info__grid max-wrapper">
        <div className="info__tile">
          <h5 className="info__heading">Learn</h5>
          <p className="info__text">
            Challenge yourself with coding challenges to strengthen your
            knowledge.
          </p>
        </div>

        <div className="info__tile">
          <h5 className="info__heading">Collaborative</h5>
          <p className="info__text">
            Pair up with a partner to tackle a challenge together.
          </p>
        </div>

        <div className="info__tile">
          <h5 className="info__heading">Compete</h5>
          <p className="info__text">
            Compete against others on the leaderboard for the top rank.
          </p>
        </div>
      </div>
    </section>

    <section className="contribute">
      <h3> Want to contribute to creating new challenges for the community?</h3>
      <a
        className="contribute__link"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/williamstyronejr/CodePair/blob/main/CONTRIBUTING.md"
      >
        Click here to learn more!
      </a>
    </section>

    <section className="footer">© 2021 CodePair</section>
  </>
);

export default HomePage;
