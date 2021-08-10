import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ajaxRequest } from '../../utils/utils';
import Loading from '../shared/Loading';
import Notification from '../shared/Notification';
import './styles/challengeList.css';

const ChallengeItem = ({ challenge, createPrivateRoom }) => {
  const [language, setLanguage] = React.useState(
    challenge.initialCode[0].language
  );

  return (
    <li className="challenges__item" key={`challenge-item-${challenge._id}`}>
      <div className="challenges__details">
        <h3 className="challenges__title">{challenge.title}</h3>
        <p className="challenges__prompt">{challenge.prompt}</p>
        <ul className="challenges__tags">
          {challenge.tags.split(',').map((tag) => (
            <li className="challenges__tag" key={`tag-${challenge._id}-${tag}`}>
              {tag.trim()}
            </li>
          ))}
        </ul>
      </div>

      <div className="challenges__options">
        <select
          className="challenges__languages"
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

        <Link
          className="challenges__link"
          to={`/c/${challenge._id}/${language}`}
          data-cy="pair"
        >
          Pair Up
        </Link>

        <button
          type="button"
          className="challenges__link"
          onClick={() => createPrivateRoom(challenge._id, language)}
          data-cy="solo"
        >
          Solo
        </button>
      </div>
    </li>
  );
};

const ChallengeListPage = (props) => {
  const [page, setPage] = React.useState(1);
  const [endOfList, setEndOfList] = React.useState(false);
  const [challenges, setChallenge] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [listError, setListError] = React.useState(null);
  const [creatingRoom, setCreatingRoom] = React.useState(false);
  const [roomError, setRoomError] = React.useState(null);
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

  const createPrivateRoom = (cId, language) => {
    if (creatingRoom) return; // Stop user from creating multiple rooms at once
    setCreatingRoom(true);
    setRoomError(null);

    ajaxRequest(`/challenge/${cId}/create`, 'POST', { language })
      .then((res) => {
        if (!res.data.room) {
          setRoomError(true);
        }
        // Redirect user to room page
        props.history.push(`/c/${cId}/r/${res.data.room}`);
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
  };

  const listItems = challenges.map((challenge) => (
    <ChallengeItem
      key={`challenge-${challenge._id}`}
      challenge={challenge}
      createPrivateRoom={createPrivateRoom}
    />
  ));

  return (
    <section className="challenges">
      {roomError ? <Notification message={roomError} /> : null}

      <header className="challenges__header">
        <div className="challenges__filter-outer">
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
                className="challenges__search"
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
        </div>
      </header>

      <div className="challenges__content">
        <ul className="challenges__list">
          {endOfList && challenges.length === 0 ? (
            <li className="challenges__item">
              <p className="challenges__empty">
                No challenge matching this search
              </p>
            </li>
          ) : null}

          {listItems}

          {!endOfList ? (
            <li
              ref={infiniteRef}
              className=" challenge__item challenges__item--end"
            >
              <Loading message="Loading ..." />
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
};

ChallengeItem.propTypes = {
  createPrivateRoom: PropTypes.func.isRequired,
  challenge: PropTypes.shape({
    _id: PropTypes.string,
    tags: PropTypes.string,
    title: PropTypes.string,
    prompt: PropTypes.string,
    initialCode: PropTypes.array,
  }).isRequired,
};

ChallengeListPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default withRouter(ChallengeListPage);
