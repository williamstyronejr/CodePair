import * as React from "react";
import PropTypes from "prop-types";
import { Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { openSocket } from "../../actions/socket";
import Timer from "../../components/shared/Timer";
import LoadingScreen from "../../components/shared/LoadingScreen";
import {
  joinQueue,
  leaveQueue,
  acceptMatch,
  declineMatch,
  clearQueue,
  matchTimeout,
} from "../../actions/queue";
import "./styles/challengeQueuePage.css";

const ChallengeQueuePage = (props: any) => {
  const { cId, lang } = useParams();
  const { leavingQueue, roomId, matchFound, acceptedMatch, declinedMatch } =
    props.queue;
  const [matchTimer, setMatchTimer] = React.useState(10);
  const queueId = `${cId}-${lang}`; // Id of queue the user is joining

  React.useEffect(() => {
    let matchInterval: number; // Interval for when a match appears
    // Keeps track of match found timer.
    if (matchFound) {
      matchInterval = setInterval(() => {
        if (matchTimer <= 0) {
          if (roomId) return;
          if (acceptedMatch) {
            setMatchTimer(10); // Reset timer
            return props.clearQueue();
          }
          return props.matchTimeout();
        }

        setMatchTimer(matchTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(matchInterval);
    };
  }, [
    matchFound,
    matchTimer,
    roomId,
    acceptedMatch,
    props.clearQueue,
    props.matchTimeout,
  ]);

  React.useEffect(() => {
    if (!props.socket.connected && !props.socket.connecting) {
      props.openSocket();
    } else if (
      props.socket.ready &&
      !props.queue.inQueue &&
      !props.queue.leavingQueue
    ) {
      props.joinQueue(queueId, 2);
    }
  }, [
    props.socket.connected,
    props.socket.ready,
    props.queue.inQueue,
    props.socket.connecting,
  ]);

  React.useEffect(() => {
    // Clean up on unmount
    return () => {
      props.leaveQueue(queueId);
      props.clearQueue();
    };
  }, [queueId]);

  if (!props.socket.ready)
    return <LoadingScreen message="Connecting to server" />;

  if (leavingQueue) return <Navigate to="/challenges" />;
  if (roomId) return <Navigate to={`/c/${cId}/r/${roomId}`} />;

  return (
    <section className="queue">
      {matchFound ? (
        <div className="queue__notification">
          <div className="queue__box">
            <h2 className="queue__heading">
              {acceptedMatch ? "Accepted Match" : "Pair Found"}
            </h2>
            <span className="queue__match-timer">{matchTimer}</span>

            {!acceptedMatch ? (
              <>
                <button
                  type="button"
                  className="btn btn--pair btn--pair-accept"
                  onClick={() => props.acceptMatch(props.queue.matchId)}
                >
                  Accept Pair
                </button>

                <button
                  type="button"
                  className="btn btn--pair btn--pair-decline"
                  onClick={props.declineMatch}
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
          onClick={() => props.leaveQueue(queueId)}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  queue: state.queue,
  socket: state.socket,
});

const mapDispatchToProps = (dispatch: any) => ({
  openSocket: () => dispatch(openSocket()),
  clearQueue: () => dispatch(clearQueue()),
  declineMatch: (id: string) => dispatch(declineMatch(id)),
  joinQueue: (cId: string, size: number) => dispatch(joinQueue(cId, size)),
  leaveQueue: (queue: string) => dispatch(leaveQueue(queue)),
  acceptMatch: (queueId: string) => dispatch(acceptMatch(queueId)),
  matchTimeout: () => dispatch(matchTimeout()),
});

ChallengeQueuePage.propTypes = {
  openSocket: PropTypes.func.isRequired,
  clearQueue: PropTypes.func.isRequired,
  declineMatch: PropTypes.func.isRequired,
  joinQueue: PropTypes.func.isRequired,
  leaveQueue: PropTypes.func.isRequired,
  acceptMatch: PropTypes.func.isRequired,
  matchTimeout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  socket: PropTypes.shape({
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    ready: PropTypes.bool,
  }).isRequired,
  queue: PropTypes.shape({
    matchId: PropTypes.string,
    inQueue: PropTypes.bool,
    leavingQueue: PropTypes.bool,
    roomId: PropTypes.string,
    matchFound: PropTypes.bool,
    acceptedMatch: PropTypes.bool,
    declinedMatch: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeQueuePage);
