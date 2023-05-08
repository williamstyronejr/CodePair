import "./styles/roadmapPage.css";

const RoadmapPage = () => (
  <section className="roadmap">
    <header className="roadmap__header">
      <h2 className="roadmap__heading">Product Roadmap</h2>

      <div>
        <h4>In progress: User profile</h4>

        <div>
          <ol className="roadmap__progress-bar">
            <li className="roadmap__step roadmap__step--complete">
              <span className="roadmap__description" />
            </li>
            <li className="roadmap__step roadmap__step--complete">
              <span className="roadmap__description">Design</span>
            </li>
            <li className="roadmap__step roadmap__step--active">
              <span className="roadmap__description">Coding</span>
            </li>
            <li className="roadmap__step">
              <span className="roadmap__description">Testing</span>
            </li>
            <li className="roadmap__step">
              <span className="roadmap__description">Deploy</span>
            </li>
          </ol>
        </div>
      </div>
    </header>

    <div className="roadmap__content">
      <div className="roadmap__group">
        <h4 className="roadmap__title">General</h4>

        <ul className="roadmap__list">
          <li className="roadmap__item">
            <div className="roadmap__checkbox" />
            <span className="roadmap__task">User Profile</span>
          </li>
          <li className="roadmap__item">
            <div className="roadmap__checkbox" />
            <span className="roadmap__task">Ranking</span>
          </li>

          <li className="roadmap__item">
            <div className="roadmap__checkbox" />
            <span className="roadmap__task">User created challenges</span>
          </li>
        </ul>
      </div>

      <div className="roadmap__group">
        <h4 className="roadmap__title">Languages</h4>

        <ul className="roadmap__list">
          <li className="roadmap__item">
            <div className="roadmap__checkbox roadmap__checkbox--active" />
            <span className="roadmap__task">Javascript</span>
          </li>
          <li className="roadmap__item">
            <div className="roadmap__checkbox" />
            <span className="roadmap__task">C++</span>
          </li>
          <li className="roadmap__item">
            <div className="roadmap__checkbox" />
            <span className="roadmap__task">Python</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

export default RoadmapPage;
