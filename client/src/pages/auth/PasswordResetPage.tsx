import { SyntheticEvent, useState } from 'react';
import { ajaxRequest } from '../../utils/utils';

const PasswordResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<{
    msg?: string;
    password?: string;
    passwordC?: string;
  }>({});
  const [status, setStatus] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const token = urlParams.get('token');

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (requesting) return;

    setRequesting(true);
    setError({});

    ajaxRequest(`/api/account/reset/password?id=${id}&token=${token}`, 'POST', {
      password,
      passwordC: confirm,
    })
      .then(() => {
        setRequesting(false);
        setStatus(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setError(
            err.response.data ? err.response.data.errors : { msg: 'ser' }
          );
        } else {
          setError({
            msg: 'Error occurred trying to reset, please check the link provided in email.',
          });
        }

        setRequesting(false);
      });
  };

  return (
    <section>
      <form className="form" onSubmit={onSubmit}>
        <h3 className="form__heading">Password Reset</h3>
        <h4 className="form__heading">Enter your new password</h4>

        {error && error.msg ? (
          <div className="form__error">
            <span data-cy="error">{error.msg}</span>
          </div>
        ) : null}

        {status ? (
          <div className="form__notification">
            <span data-cy="success">Password has been updated.</span>
          </div>
        ) : null}

        <fieldset className="form__field">
          <label className="form__label" htmlFor="password">
            <span className="form__labeling">Password</span>

            {error && error.password ? (
              <span className="form__error" data-cy="error">
                {error.password}
              </span>
            ) : null}

            <input
              id="password"
              name="password"
              className="form__input form__input--text"
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              data-cy="password"
              autoComplete="new-password"
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="passwordC">
            <span className="form__labeling">Confirm Password</span>

            {error && error.passwordC ? (
              <span className="form__error" data-cy="error">
                {error.passwordC}
              </span>
            ) : null}

            <input
              id="passwordC"
              name="passwordC"
              className="form__input form__input--text"
              type="password"
              value={confirm}
              onChange={(evt) => setConfirm(evt.target.value)}
              data-cy="passwordConfirm"
              autoComplete="new-password"
            />
          </label>
        </fieldset>

        <button
          className="btn btn--submit"
          type="submit"
          disabled={requesting}
          data-cy="submit"
        >
          {requesting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Change Password
        </button>
      </form>
    </section>
  );
};

export default PasswordResetPage;
