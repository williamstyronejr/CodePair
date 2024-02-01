import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ajaxRequest } from '../../utils/utils';
import Loading from '../../components/shared/Loading';
import LoadingScreen from '../../components/shared/LoadingScreen';
import useGetChallenges from '../../hooks/api/useGetChallenges';
import './styles/challengeList.css';
import './styles/challengeModal.css';

const ChallengeModal = ({
  challenge,
  onClose,
}: {
  challenge: any;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomError, setRoomError] = useState<boolean | string>(false);
  const [language, setLanguage] = useState(challenge.initialCode[0].language);

  useEffect(() => {
    const onEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);

    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const createPrivateRoom = useCallback((challengeId: string, lang: string) => {
    setCreatingRoom(true);
    setRoomError(false);

    ajaxRequest(`/api/challenge/${challengeId}/create`, 'POST', {
      language: lang,
    })
      .then((res) => {
        if (!res.data.room) {
          setRoomError(true);
        }

        navigate(`/c/${challengeId}/r/${res.data.room}`);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setRoomError(
            'Invalid language, please selected a different language.',
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
              className="challenge__modal-close transition-colors"
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
                {challenge.initialCode.map((data: any) => (
                  <option value={data.language} key={data.language}>
                    {data.language}
                  </option>
                ))}
              </select>

              <hr className="challenge__modal-dividor" />

              <div className="challenge__modal-wrapper">
                <Link
                  className="challenge__modal-link transition-colors"
                  to={`/c/${challenge._id}/${language}`}
                  data-cy="challenge-pair"
                >
                  Join Queue
                </Link>

                <button
                  className="challenge__modal-link transition-colors"
                  data-cy="challenge-solo"
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

// const ChallengeItem = ({
//   challenge,
//   setSelected,
// }: {
//   challenge: any;
//   setSelected: Function;
// }) => {
//   return (
//     <div className="challenges__item" key={`challenge-item-${challenge._id}`}>
//       <div className="challenges__details">
//         <button
//           className="transition-colors challenges__title"
//           type="button"
//           onClick={() => setSelected(challenge)}
//         >
//           {challenge.title}
//         </button>
//       </div>
//     </div>
//   );
// };

const ChallengeListPage = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { data, fetchNextPage, hasNextPage, error, isFetching } =
    useGetChallenges({
      search,
      sortBy,
    });

  const [infiniteRef] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: !!error,
    rootMargin: '0px 0px 200px 0px',
  });

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
              className="challenges__search transition-colors"
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
          {data
            ? data.pages.map((challenges) =>
                challenges.map((challenge) => (
                  <div key={challenge._id} className="challenges__item">
                    <div className="challenges__info">
                      <h3 className="challenges__title">{challenge.title}</h3>

                      <div className="challenges__summary">
                        {challenge.summary || challenge.prompt}
                      </div>
                    </div>

                    <div className="challenges__options">
                      <button
                        className="challenges__select transition-colors"
                        type="button"
                        onClick={() => setSelected(challenge)}
                        data-cy="select-challenge"
                      >
                        Start Challenge
                      </button>
                    </div>
                  </div>
                )),
              )
            : null}

          {!hasNextPage && data && data.pageParams.length === 1 ? (
            <div className="challenges__item">
              <p className="challenges__empty">
                No challenge matching this search
              </p>
            </div>
          ) : null}

          {hasNextPage ? (
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

export default ChallengeListPage;
