import { useState, SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { setUserData } from '../../reducers/userReducer';
import { validateUsername, ajaxRequest } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../hooks/reactRedux';

const GithubPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [validation, setValidation] = useState<{ username?: string }>({});
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in with no username
  if (!user.authenticating && (!user.authenticated || user.username)) {
    return <Navigate to="/challenges" />;
  }

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (requesting) return;
    setError(null);
    setValidation({});

    const userValidation = validateUsername(username);

    if (userValidation)
      return setValidation({ ...validation, username: userValidation });

    setRequesting(true);

    ajaxRequest('/account/register', 'POST', { username })
      .then((res) => {
        setRequesting(false);
        dispatch(setUserData(res.data.user));
      })
      .catch((err) => {
        setRequesting(false);
        if (err.response && err.response.status === 400) {
          setError(err.response.data.errors.username);
          return;
        }

        setError(
          'An error occurred with setting your username, please try again.'
        );
      });
  };

  return (
    <section>
      <form className="form" method="POST" onSubmit={onSubmit}>
        <h3 className="form__heading">Github User Registration</h3>

        {error ? (
          <div className="form__error" data-cy="error">
            <p className="">{error}</p>
          </div>
        ) : null}

        <fieldset className="form__field">
          <label className="form__label" htmlFor="username">
            <span className="form__labeling">Username</span>
            {validation.username ? (
              <span className="form__error">{validation.username}</span>
            ) : null}

            <input
              className="form__input form__input--text"
              id="username"
              type="text"
              data-cy="username"
              onChange={(evt) => setUsername(evt.target.value)}
              value={username}
            />
          </label>
        </fieldset>

        <button
          className="btn btn--submit"
          type="submit"
          data-cy="submit"
          disabled={requesting}
        >
          {requesting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Set Username
        </button>
      </form>
    </section>
  );
};

export default GithubPage;
