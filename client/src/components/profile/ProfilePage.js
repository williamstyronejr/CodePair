import * as React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Loading from '../shared/Loading';
import { ajaxRequest, dateToText } from '../../utils/utils';
import './styles/profilePage.css';

const UserNotFound = () => (
  <section className="profile profile--missing">
    <h1 className="profile__404">404</h1>
    <h3 className="profile__error">Account not found!</h3>
  </section>
);

const Stats = ({ challengesCompleted, achievements }) => {
  const achievementList = achievements.map((item) => (
    <li className="stats__item" key={item.name}>
      <div className="stats__">{item.name}</div>
    </li>
  ));

  return (
    <div className="stats">
      <div className="stats__info">
        <h2 className="stats__heading">Progress</h2>

        <div>
          Completed Challenges: <span>{challengesCompleted}</span>
        </div>
      </div>

      <div className="stats__achievements">
        <h2 className="stats__heading">Achievements</h2>
        <ul className="stats__list">
          {achievements.length === 0 ? (
            <li className="stats__item">
              No achievements unlocked, complete more challenges to unlock more.
            </li>
          ) : (
            achievementList
          )}
        </ul>
      </div>
    </div>
  );
};

const Solutions = ({ username }) => {
  const [solutions, setSolutions] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [endOfList, setEndOfList] = React.useState(false);
  const [error, setError] = React.useState(null);

  const getSolutions = () => {
    if (loading) return;

    setLoading(true);

    ajaxRequest(`/user/${username}/profile/solutions?page=${page}`)
      .then((res) => {
        if (res.data.solutions.length === 0) {
          setEndOfList(true);
          return setLoading(false);
        }

        setSolutions([...solutions, ...res.data.solutions]);
        setLoading(false);
        setPage(page + 1);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage: !endOfList,
    disabled: !!error,
    onLoadMore: getSolutions,
    rootMargin: '0px 0px 200px 0px',
  });

  const solutionList = solutions.map((item) => (
    <li key={item._id} className="solutions__item">
      <h3 className="solutions__heading">{item.challengeName}</h3>
      <div className="solutions__language">{item.language}</div>
      <div className="solutions__content">
        <CodeMirror
          className="solutions__code"
          value={item.code}
          options={{
            lineNumbers: true,
            lineWrapping: true,
            theme: 'dracula',
            tabSize: 2,
            mode: 'javascript',
          }}
          onBeforeChange={(editor, data, value) => {
            // Nothing to prevent data change
          }}
          onChange={(editor, data, value) => {}}
        />
      </div>
    </li>
  ));

  return (
    <div className="solutions">
      <ul className="solutions__list">
        {solutionList}

        {endOfList && solutions.length === 0 ? (
          <li className="solutions__item">
            <h3 className="solutions__heading">
              Challenge solution will be seen here
            </h3>
          </li>
        ) : null}

        {!endOfList ? (
          <li
            ref={infiniteRef}
            className="solutions__item solutions__item--end"
          >
            <Loading />
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const ProfilePage = (props) => {
  const { username } = useParams();
  const [profileData, setProfileData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [selected, setSelected] = React.useState('stats');

  React.useEffect(() => {
    // Grab profile data
    ajaxRequest(`/user/${username}/profile/stats`)
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if (error) return <UserNotFound />;

  let content = null;
  switch (selected) {
    case 'stats':
      content = (
        <Stats
          challengesCompleted={profileData.completed}
          achievements={profileData.achievements}
        />
      );
      break;
    case 'solutions':
      content = <Solutions username={username} />;
      break;

    default:
      break;
  }

  return (
    <div className="profile">
      <section className="profile__user">
        <header className="profile__header">
          <img
            className="profile__image"
            alt="User profile"
            src={`/img/${profileData.profileImage}`}
          />

          <div className="profile__info">
            <h4 className="profile__heading">{profileData.displayName}</h4>
            <div className="profile__date">
              Member Since: {dateToText(profileData.created)}
            </div>
          </div>
        </header>
      </section>

      <section className="profile__data">
        <header className="profile__nav-header">
          <nav className="profile__nav">
            <ul className="profile__nav-list">
              <li className="profile__nav-item">
                <button
                  className={`profile__nav-btn ${
                    selected === 'stats' ? 'profile__nav-btn--active' : ''
                  }`}
                  type="button"
                  onClick={() => setSelected('stats')}
                  disabled={selected === 'stats'}
                >
                  Stats
                </button>
              </li>

              <li className="profile__nav-item">
                <button
                  className={`profile__nav-btn ${
                    selected === 'solutions' ? 'profile__nav-btn--active' : ''
                  }`}
                  type="button"
                  onClick={() => setSelected('solutions')}
                  disabled={selected === 'solutions'}
                >
                  Solutions
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <div className="profile__content">{content}</div>
      </section>
    </div>
  );
};

const mapStateToDispatch = (state) => ({
  user: state.user,
});

Stats.propTypes = {
  challengesCompleted: PropTypes.number.isRequired,
  achievements: PropTypes.array.isRequired,
};

Solutions.propTypes = {
  username: PropTypes.string.isRequired,
};

ProfilePage.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToDispatch, null)(ProfilePage);
