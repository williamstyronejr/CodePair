import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ajaxRequest } from '../../utils/utils';
import Loading from '../shared/Loading';
import LoadingScreen from '../shared/LoadingScreen';

import './styles/challengeList.css';
import './styles/challengeModal.css';

const ChallengeModal = ({ challenge, onClose }) => {
  const [creatingRoom, setCreatingRoom] = React.useState(false);
  const [roomError, setRoomError] = React.useState(null);
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState(
    challenge.initialCode[0].language
  );

  React.useEffect(() => {
    const onEsc = (evt) => {
      if (evt.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);

    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  const createPrivateRoom = React.useCallback((challengeId, lang) => {
    setCreatingRoom(true);
    setRoomError(false);

    ajaxRequest(`/challenge/${challengeId}/create`, 'POST', { language: lang })
      .then((res) => {
        if (!res.data.room) {
          setRoomError(true);
        }

        navigate(`/c/${challengeId}/r/${res.data.room}`);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setRoomError(
            'Invalid language, please selected a different language.'
          );
        } else if (err.response && err.response.status === 500) {
          setRoomError('Server error ocurred, please try again.');
        }
        setCreatingRoom(false);
      });
  }, []);

  return (
    <div className="challenge__modal">
      <div className="challenge__modal-content">
        {creatingRoom && !roomError ? (
          <LoadingScreen message="Creating Room" />
        ) : (
          <header className="challenge__modal-header">
            <button
              className="transition-colors challenge__modal-close"
              type="button"
              onClick={() => onClose()}
            >
              <i className="fas fa-times" />
            </button>
          </header>
        )}

        {roomError ? (
          <div className="challenge__modal-error">
            An error occurred during request, please try again.
          </div>
        ) : null}

        {!creatingRoom && !roomError ? (
          <>
            <div className="challenge__modal-details">
              <h3 className="challenge__modal-title">{challenge.title}</h3>

              <p className="challenge__modal-prompt">
                {challenge.summary || challenge.prompt}
              </p>
            </div>

            <hr className="challenge__modal-dividor" />

            <div className="challenge__modal-options">
              <h4 className="">Select Language</h4>
              <select
                className="challenge__modal-languages"
                value={language}
                onChange={(evt) => {
                  setLanguage(evt.target.value);
                }}
              >
                {challenge.initialCode.map((data) => (
                  <option value={data.language} key={data.language}>
                    {data.language}
                  </option>
                ))}
              </select>

              <hr className="challenge__modal-dividor" />

              <div className="challenge__modal-wrapper">
                <Link
                  className="transition-colors challenge__modal-link"
                  to={`/c/${challenge._id}/${language}`}
                >
                  Join Queue
                </Link>

                <button
                  className="transition-colors challenge__modal-link"
                  data-cy="solo"
                  type="button"
                  onClick={() => createPrivateRoom(challenge._id, language)}
                >
                  Solo
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const ChallengeItem = ({ challenge, setSelected }) => {
  return (
    <div className="challenges__item" key={`challenge-item-${challenge._id}`}>
      <div className="challenges__details">
        <button
          className="transition-colors challenges__title"
          type="button"
          onClick={() => setSelected(challenge)}
        >
          {challenge.title}
        </button>
      </div>
    </div>
  );
};

const ChallengeListPage = (props) => {
  const [page, setPage] = React.useState(1);
  const [endOfList, setEndOfList] = React.useState(false);
  const [challenges, setChallenge] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [listError, setListError] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('newest');

  const getChallenges = () => {
    if (loadingList) return; // Stops from sending multiple request to update
    setLoadingList(true);

    ajaxRequest(
      `/challenge/list?page=${page}&orderBy=${sortBy}&search=${search}`,
      'GET'
    )
      .then((res) => {
        // Empty list if first page  to clear results from previous filtering
        if (res.data.challenges.length === 0) {
          if (page === 1) setChallenge([]);
          setEndOfList(true);
          return setLoadingList(false);
        }

        setChallenge(
          page === 1
            ? [...res.data.challenges]
            : [...challenges, ...res.data.challenges]
        );
        setPage(page + 1);
        setLoadingList(false);
      })
      .catch((err) => {
        setEndOfList(true);
        setListError(true);
        setLoadingList(false);
      });
  };

  const [infiniteRef] = useInfiniteScroll({
    loading: loadingList,
    hasNextPage: !endOfList,
    onLoadMore: getChallenges,
    disabled: !!listError,
    rootMargin: '0px 0px 200px 0px',
  });

  React.useEffect(() => {
    getChallenges(page, sortBy, search);
  }, []);

  React.useEffect(() => {
    // Fetch list whenever page is set to 1 due to filter changes
    if (page === 1) getChallenges();
  }, [page]);

  return (
    <section className="challenges">
      <header className="challenges__header">
        <div className="challenges__filter">
          <form
            className="challenges__option challenges__option--flex"
            onSubmit={(evt) => {
              evt.preventDefault();
              setEndOfList(false);
              setPage(1);
            }}
          >
            <input
              className="transition-colors challenges__search"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
            />
            <button className="challenges__search-btn" type="submit">
              Search
            </button>
          </form>

          <div className="challenges__option">
            <label htmlFor="sortBy">
              <span className="challenges__option-heading">Sort By</span>
              <select
                id="sortBy"
                className="challenges__sort"
                value={sortBy}
                onChange={(evt) => {
                  setSortBy(evt.target.value);
                  setEndOfList(false);
                  setPage(1);
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="challenges__content">
        {selected ? (
          <ChallengeModal
            challenge={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}

        <div className="challenges__list">
          <table className="challenges__table">
            <thead className="challenges__table-header">
              <tr>
                <th className="challenges__table-heading">Problem</th>
                <th className="challenges__table-heading">Difficulty</th>
              </tr>
            </thead>

            <tbody>
              {challenges.map((challenge) => (
                <tr className="challenges__table-row">
                  <td className="challenges__cell-max">
                    <button
                      className="transition-colors challenges__title"
                      type="button"
                      onClick={() => setSelected(challenge)}
                    >
                      {challenge.title}
                    </button>
                  </td>

                  <td
                    className={`challenges__table-level 
                  challenges__table-level--${
                    challenge.difficulty
                      ? challenge.difficulty.toLowerCase()
                      : 'easy'
                  }`}
                  >
                    {challenge.difficulty || 'Easy'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {endOfList && challenges.length === 0 ? (
            <div className="challenges__item">
              <p className="challenges__empty">
                No challenge matching this search
              </p>
            </div>
          ) : null}

          {!endOfList ? (
            <div
              ref={infiniteRef}
              className=" challenge__item challenges__item--end"
            >
              <Loading message="Loading ..." />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

ChallengeItem.propTypes = {
  setSelected: PropTypes.func.isRequired,
  challenge: PropTypes.shape({
    _id: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string,
    prompt: PropTypes.string,
    initialCode: PropTypes.array,
  }).isRequired,
};

ChallengeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  challenge: PropTypes.shape({
    _id: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string,
    prompt: PropTypes.string,
    summary: PropTypes.string,
    initialCode: PropTypes.array,
  }).isRequired,
};

export default ChallengeListPage;
