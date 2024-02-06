import { useState, useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Timer from '../../components/shared/Timer';
import LoadingScreen from '../../components/shared/LoadingScreen';
import useUserContext from '../../hooks/context/useUserContext';
import socket from '../../utils/socket';
import './styles/challengeQueuePage.css';

const ChallengeQueuePage = () => {
  const user = useUserContext();
  const { cId, lang } = useParams();
  const [ready, setReady] = useState(false);
  const [matchId, setMatchId] = useState('');
  const [matchStatus, setMatchStatus] = useState<
    'pending' | 'found' | 'accepted' | 'declined'
  >('pending');
  const [matchTimer, setMatchTimer] = useState(10);
  const [roomId, setRoomId] = useState('');
  const queueId = useMemo(() => `${cId}-${lang}`, [cId, lang]); // Match queueid

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('logUser', user?.id);
    });

    socket.on('userLogged', () => {
      console.log('user logged');
      setReady(true);
    });

    return () => {
      socket.emit('leaveQueue', queueId);
      socket.off('userLogged');
    };
  }, [user, queueId]);

  useEffect(() => {
    if (ready && matchStatus === 'pending') {
      socket.emit('joinQueue', queueId, 2);

      return () => {
        socket.off('joinQueue');
      };
    }
  }, [ready, queueId, matchStatus]);

  useEffect(() => {
    socket.on('matchFound', (id: string) => {
      setMatchStatus('found');
      setMatchId(id);
    });

    socket.on('roomCreated', (roomId: string) => {
      setRoomId(roomId);
    });

    socket.connect();
    return () => {
      socket.off('matchFound');
      socket.off('roomCreated');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let matchInterval: number;
    if (matchStatus === 'accepted' && matchTimer <= 0) {
      setMatchStatus('pending');
      setMatchTimer(10);
    } else if (matchStatus === 'found' || matchStatus === 'accepted') {
      matchInterval = window.setTimeout(() => {
        if (matchTimer <= 0) {
          setMatchStatus('declined');
        } else {
          setMatchTimer((old) => old - 1);
        }
      }, 1000);
    }

    return () => {
      if (matchInterval) clearTimeout(matchInterval);
    };
  }, [matchStatus, matchTimer]);

  if (!ready) return <LoadingScreen message="Connecting to server" />;
  if (matchStatus === 'declined') return <Navigate to="/challenges" />;
  if (roomId !== '') return <Navigate to={`/c/${cId}/r/${roomId}`} />;

  return (
    <section className="queue" data-cy="challenge-queue">
      {matchStatus !== 'pending' ? (
        <div className="queue__notification">
          <div className="queue__box">
            <h2 className="queue__heading">
              {matchStatus === 'accepted' ? 'Accepted Match' : 'Pair Found'}
            </h2>
            <span className="queue__match-timer">{matchTimer}</span>

            {matchStatus !== 'accepted' ? (
              <>
                <button
                  type="button"
                  className="btn btn--pair btn--pair-accept"
                  onClick={() => {
                    socket.emit('acceptMatch', matchId);
                    setMatchStatus('accepted');
                  }}
                >
                  Accept Pair
                </button>

                <button
                  type="button"
                  className="btn btn--pair btn--pair-decline"
                  onClick={() => {
                    setMatchStatus('declined');
                  }}
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
        <Timer isPaused={matchStatus !== 'pending'} />

        <button
          className="btn btn--cancel"
          type="button"
          data-cy="cancel"
          onClick={() => {
            setMatchStatus('declined');
          }}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default ChallengeQueuePage;
