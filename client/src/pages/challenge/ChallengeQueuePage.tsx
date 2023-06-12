import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reactRedux';
import { openSocket } from '../../reducers/socketReducer';
import Timer from '../../components/shared/Timer';
import LoadingScreen from '../../components/shared/LoadingScreen';
import {
  joinQueue,
  leaveQueue,
  clearQueue,
  declineQueue,
  acceptQueue,
  matchTimeout,
} from '../../reducers/queueReducer';
import './styles/challengeQueuePage.css';

const ChallengeQueuePage = () => {
  const dispatch = useAppDispatch();
  const { queue, socket } = useAppSelector((state) => ({
    socket: state.socket,
    queue: state.queue,
  }));
  const { cId, lang } = useParams();
  const { leavingQueue, roomId, matchFound, acceptedMatch, declinedMatch } =
    queue;
  const [matchTimer, setMatchTimer] = useState(10);
  const queueId = `${cId}-${lang}`; // Id of queue the user is joining

  useEffect(() => {
    let matchInterval: number; // Interval for when a match appears
    // Keeps track of match found timer.
    if (matchFound) {
      matchInterval = window.setInterval(() => {
        if (matchTimer <= 0) {
          if (roomId !== '') return;
          if (acceptedMatch) {
            setMatchTimer(10); // Reset timer
            return dispatch(clearQueue());
          }
          return dispatch(matchTimeout());
        }

        setMatchTimer(matchTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(matchInterval);
    };
  }, [matchFound, matchTimer, roomId, acceptedMatch, dispatch]);

  useEffect(() => {
    if (!socket.connected && !socket.connecting) {
      dispatch(openSocket());
    } else if (socket.ready && !queue.inQueue && !queue.leavingQueue) {
      dispatch(joinQueue({ cId: queueId, size: 2 }));
    }
  }, [
    socket.connected,
    socket.ready,
    queue.inQueue,
    queue.leavingQueue,
    socket.connecting,
    queueId,
    dispatch,
  ]);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      dispatch(leaveQueue(queueId));
      dispatch(clearQueue());
    };
  }, [dispatch, queueId]);

  if (!socket.ready) return <LoadingScreen message="Connecting to server" />;

  if (leavingQueue) return <Navigate to="/challenges" />;
  if (roomId !== '') return <Navigate to={`/c/${cId}/r/${roomId}`} />;

  return (
    <section className="queue" data-cy="challenge-queue">
      {matchFound ? (
        <div className="queue__notification">
          <div className="queue__box">
            <h2 className="queue__heading">
              {acceptedMatch ? 'Accepted Match' : 'Pair Found'}
            </h2>
            <span className="queue__match-timer">{matchTimer}</span>

            {!acceptedMatch ? (
              <>
                <button
                  type="button"
                  className="btn btn--pair btn--pair-accept"
                  onClick={() => dispatch(acceptQueue(queue.matchId))}
                >
                  Accept Pair
                </button>

                <button
                  type="button"
                  className="btn btn--pair btn--pair-decline"
                  onClick={() => dispatch(declineQueue(queue.matchId))}
                >
                  Decline Pair
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <header className="queue__header">
        <h2 className="queue__heading">In Queue</h2>
      </header>

      <div className="queue__info">
        <Timer
          isPaused={
            (matchFound && !acceptedMatch && !declinedMatch) || acceptedMatch
          }
        />

        <button
          className="btn btn--cancel"
          type="button"
          data-cy="cancel"
          onClick={() => dispatch(leaveQueue(queueId))}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default ChallengeQueuePage;
