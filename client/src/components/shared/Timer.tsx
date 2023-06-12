import { useState, useEffect } from 'react';
import './styles/timer.css';

/**
 * Converts a number into a string and adds a zero in front.
 * @param {Number} number A number to convert to string
 * @return {String} Returns a string of the number with a zero in front.
 */
function addLeadingZero(number: number) {
  return (new Array(3).join('0') + number).slice(-2);
}

// Not completely accraute
const Timer = ({ isPaused }: { isPaused: boolean }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerInterval = window.setInterval(() => {
      if (!isPaused) setTimer((time) => time + 1);
    }, 1000);

    // Clean up
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="timer" data-cy="queue-timer">
      <span className="timer__hour">
        {addLeadingZero(Math.floor(timer / 60))}
      </span>
      :<span className="timer__minute">{addLeadingZero(timer % 60)}</span>
    </div>
  );
};

export default Timer;
