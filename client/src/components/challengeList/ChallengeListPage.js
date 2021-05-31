import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { ajaxRequest } from '../../utils/utils';
import LoadingComponent from '../shared/Loading';
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
  const [page, setPage] = React.useState(0);
  const [endOfList, setEndOfList] = React.useState(false);
  const [challenges, setChallenge] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [listError, setListError] = React.useState(null);
  const [creatingRoom, setCreatingRoom] = React.useState(false);
  const [roomError, setRoomError] = React.useState(null);

  const getChallenges = () => {
    if (loadingList) return; // Stops from sending multiple request to update

    setLoadingList(true);

    ajaxRequest(`/challenge/list?page=${page}`, 'GET')
      .then((res) => {
        // If list is empty, set end of list to be true
        if (res.data.challenges.length === 0) {
          setEndOfList(true);
          return setLoadingList(false);
        }

        setPage(page + 1);
        setChallenge([...challenges, ...res.data.challenges]);
        setLoadingList(false);
      })
      .catch((err) => {
        setListError(true);
        setLoadingList(false);
      });
  };

  React.useEffect(() => {
    if (challenges.length === 0) getChallenges(0);
  }, []);

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

  // Displays loading indicator
  if (challenges.length === 0) {
    return <LoadingComponent error={endOfList} />;
  }

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
      <header className="">
        <div className="challenges__filter-list" />
      </header>

      <ul className="challenges__list">
        <InfiniteScroll
          key="scroll"
          pageStart={0}
          loadMore={getChallenges}
          hasMore={!endOfList}
          loader={<LoadingComponent key={0} />}
          useWindow={false}
        >
          {listItems}
        </InfiniteScroll>
      </ul>
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
