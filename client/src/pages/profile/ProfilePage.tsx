import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from 'rodemirror';
import useGetProfile from '../../hooks/api/useGetProfile';
import useGetSolutions from '../../hooks/api/useGetSolutions';
import Loading from '../../components/shared/Loading';
import basicExts from '../../utils/codemirror';
import { dateToText } from '../../utils/utils';
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
  const extensions = useMemo(() => [...basicExts, javascript()], []);
  const { data, fetchNextPage, hasNextPage, error, isFetching } =
    useGetSolutions({ username });

  const [infiniteRef] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage: hasNextPage,
    disabled: !!error,
    onLoadMore: fetchNextPage,
    rootMargin: '0px 0px 200px 0px',
  });

  return (
    <div className="solutions">
      <ul className="solutions__list">
        {data &&
          data.pages.map((solutions) =>
            solutions.map((solution) => (
              <li key={`solution-${solution._id}`} className="solutions__item">
                <h3 className="solutions__heading">{solution.challengeName}</h3>
                <div className="solutions__language">{solution.language}</div>
                <div className="solutions__content">
                  <CodeMirror
                    // className="solutions__code"
                    value={solution.code}
                    extensions={extensions}
                  />
                </div>
              </li>
            ))
          )}

        {!hasNextPage && data && data.pageParams.length === 1 ? (
          <li className="solutions__item">
            <h3 className="solutions__heading">
              Challenge solution will be seen here
            </h3>
          </li>
        ) : null}

        {hasNextPage ? (
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
  const [selected, setSelected] = useState('stats');
  const { data, isPending, error } = useGetProfile({
    username: username || '',
  });

  if (isPending) return <Loading />;
  if (error) return <UserNotFound />;

  let content = null;

  switch (selected) {
    case 'stats':
      content = (
        <Stats
          challengesCompleted={data.completed}
          achievements={data.achievements}
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
            src={data.profileImage}
          />

          <div className="profile__info">
            <h4 className="profile__heading">{data.displayName}</h4>
            <div className="profile__date">
              Member Since: {dateToText(data.created)}
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
