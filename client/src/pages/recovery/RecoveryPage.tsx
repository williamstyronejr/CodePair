import { SyntheticEvent, useState } from 'react';
import { ajaxRequest } from '../../utils/utils';
import './styles/recoveryPage.css';

const RecoveryPage = () => {
  const [field, setField] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState<string | boolean>(false);

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (requesting) return;

    setRequesting(true);
    setStatus(false);
    setError(false);

    ajaxRequest('/api/account/recovery/password', 'POST', { field })
      .then(() => {
        setStatus(true);
        setRequesting(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setError('Can not recover password for github user.');
        } else {
          setError('An server error has occurred, please try again.');
        }
        setRequesting(false);
      });
  };

  return (
    <section className="recovery">
      <form className="form" onSubmit={onSubmit}>
        <h2 className="form__heading">Reset Password</h2>
        <p className="form__heading">
          Enter your username below to receive a link to reset your password.
        </p>

        {error ? (
          <div className="form__error">
            <span data-cy="error">{error}</span>
          </div>
        ) : null}

        {status ? (
          <div className="form__notification">
            <span data-cy="success">
              If an account was found, an email with password reset instructions
              will be sent to your email address.
            </span>
          </div>
        ) : null}

        <fieldset className="form__field">
          <label className="form__label" htmlFor="field">
            <span className="form__labeling">Username</span>
            <input
              id="field"
              className="form__input form__input--text"
              type="text"
              value={field}
              onChange={(evt) => setField(evt.target.value)}
              data-cy="field"
            />
          </label>
        </fieldset>

        <button
          className="btn btn--submit btn--auth"
          type="submit"
          disabled={requesting}
          data-cy="submit"
        >
          Send Email
        </button>
      </form>
    </section>
  );
};

export default RecoveryPage;
