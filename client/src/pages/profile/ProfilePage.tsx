import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from 'rodemirror';
import Loading from '../../components/shared/Loading';
import basicExts from '../../utils/codemirror';
import { ajaxRequest, dateToText } from '../../utils/utils';
import './styles/profilePage.css';

const UserNotFound = () => (
  <section className="profile profile--missing">
    <h1 className="profile__404">404</h1>
    <h3 className="profile__error">Account not found!</h3>
  </section>
);

const Stats = ({
  challengesCompleted,
  achievements,
}: {
  challengesCompleted: any;
  achievements: any;
}) => {
  const achievementList = achievements.map((item: any) => (
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

const Solutions = ({ username }: { username: string }) => {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const extensions = useMemo(() => [...basicExts, javascript()], []);

  const getSolutions = () => {
    if (loading) return;

    setLoading(true);

    ajaxRequest(`/api/user/${username}/profile/solutions?page=${page}`)
      .then((res) => {
        if (res.data.solutions.length === 0) {
          setEndOfList(true);
          return setLoading(false);
        }

        setSolutions((old) => [...old, ...res.data.solutions]);
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => {
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
          // className="solutions__code"
          value={item.code}
          extensions={extensions}
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

const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState('stats');

  useEffect(() => {
    // Grab profile data
    ajaxRequest(`/api/user/${username}/profile/stats`)
      .then((res) => {
        setProfileData(res.data);
      })
      .catch(() => {
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
      content = <Solutions username={username as string} />;
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
            src={profileData.profileImage}
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

export default ProfilePage;
