import './styles/roadmapPage.css';

// const RoadmapPage = () => (
//   <section className="roadmap">
//     <header className="roadmap__header">
//       <h2 className="roadmap__heading">Product Roadmap</h2>

//       <div>
//         <h4>In progress: User profile</h4>

//         <div>
//           <ol className="roadmap__progress-bar">
//             <li className="roadmap__step roadmap__step--complete">
//               <span className="roadmap__description" />
//             </li>
//             <li className="roadmap__step roadmap__step--complete">
//               <span className="roadmap__description">Design</span>
//             </li>
//             <li className="roadmap__step roadmap__step--active">
//               <span className="roadmap__description">Coding</span>
//             </li>
//             <li className="roadmap__step">
//               <span className="roadmap__description">Testing</span>
//             </li>
//             <li className="roadmap__step">
//               <span className="roadmap__description">Deploy</span>
//             </li>
//           </ol>
//         </div>
//       </div>
//     </header>

//     <div className="roadmap__content">
//       <div className="roadmap__group">
//         <h4 className="roadmap__title">General</h4>

//         <ul className="roadmap__list">
//           <li className="roadmap__item">
//             <div className="roadmap__checkbox" />
//             <span className="roadmap__task">User Profile</span>
//           </li>
//           <li className="roadmap__item">
//             <div className="roadmap__checkbox" />
//             <span className="roadmap__task">Ranking</span>
//           </li>

//           <li className="roadmap__item">
//             <div className="roadmap__checkbox" />
//             <span className="roadmap__task">User created challenges</span>
//           </li>
//         </ul>
//       </div>

//       <div className="roadmap__group">
//         <h4 className="roadmap__title">Languages</h4>

//         <ul className="roadmap__list">
//           <li className="roadmap__item">
//             <div className="roadmap__checkbox roadmap__checkbox--active" />
//             <span className="roadmap__task">Javascript</span>
//           </li>
//           <li className="roadmap__item">
//             <div className="roadmap__checkbox" />
//             <span className="roadmap__task">C++</span>
//           </li>
//           <li className="roadmap__item">
//             <div className="roadmap__checkbox" />
//             <span className="roadmap__task">Python</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   </section>
// );

const RoadmapPage = () => {
  return (
    <section className="roadmap">
      <header className="roadmap__header">
        <div className="roadmap__wrapper">
          <h3 className="roadmap__heading">Roapmap</h3>
          <p className="roadmap__subheading">
            Check back to see what is being developed
          </p>
        </div>
      </header>

      <div className="roadmap__entries">
        <div className="roadmap__entry roadmap__entry--current">
          <div className="roadmap__line" />
          <div className="roadmap__line-fade" />
          <div className="roadmap__icon-wrapper">
            <div className="roadmap__icon-bg">
              <svg
                viewBox="0 0 24 24"
                className="roadmap__icon"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <linearGradient id="Gradient" gradientTransform="rotate(90)">
                  <stop className="info__info-stop1" offset="5%" />
                  <stop className="info__info-stop2" offset="95%" />
                </linearGradient>
                <g>
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </div>

          <div className="roadmap__info">
            <h4 className="roadmap__entry-title">Collab Editor</h4>
            <p className="roadmap__entry-description">
              Better tools for code editor for working collaboration with other
              users. Includes showing other users hightlight and cursor
              position.
            </p>
          </div>
        </div>

        <div className="roadmap__entry">
          <div className="roadmap__line" />
          <div className="roadmap__line-fade" />
          <div className="roadmap__icon-wrapper">
            <div className="roadmap__icon-bg">
              <svg
                viewBox="0 0 24 24"
                className="roadmap__icon"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <linearGradient id="Gradient" gradientTransform="rotate(90)">
                  <stop className="info__info-stop1" offset="5%" />
                  <stop className="info__info-stop2" offset="95%" />
                </linearGradient>
                <g>
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </div>

          <div className="roadmap__info">
            <h4 className="roadmap__entry-title">Initial Launch</h4>
            <p className="roadmap__entry-description">
              Version 1.0 of site with working challenges, collab coding, and
              matchmaking.{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default RoadmapPage;
