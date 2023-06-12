import { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ajaxRequest } from '../../utils/utils';
import { setUserData } from '../../reducers/userReducer';
import GithubButton from '../auth/GithubButton';
import { useAppDispatch, useAppSelector } from '../../hooks/reactRedux';
import './styles/signupPage.css';

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<{
    confirm?: string;
    password?: string;
    email?: string;
    username?: string;
    general?: string;
  }>({});

  if (user.authenticated) return <Navigate to="/challenges" />;

  function onSubmit(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (requesting) return;

    setRequesting(true);
    setError({});

    ajaxRequest('/api/signup', 'POST', {
      username,
      password,
      confirm,
      email,
    })
      .then((res) => {
        setRequesting(false);
        if (res.data.success) dispatch(setUserData(res.data.user));
      })
      .catch((err) => {
        setRequesting(false);
        if (err.response && err.response.data)
          return setError(err.response.data.errors);
        setError({ general: 'Server error occurred, please try again.' });
      });
  }

  return (
    <section className="signup">
      <form className="form" onSubmit={onSubmit}>
        <h1 className="form__heading">Create your account</h1>

        <GithubButton />

        <div className="separator">
          <hr />
          <span>Or</span>
          <hr />
        </div>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="email">
            <span className="form__labeling">Email</span>

            {error.email && (
              <span className="form__error" data-cy="error">
                {error.email}
              </span>
            )}

            <input
              id="email"
              name="email"
              className="form__input form__input--text"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              data-cy="email"
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="username">
            <span className="form__labeling">Username</span>

            {error.username && (
              <span className="form__error" data-cy="error">
                {error.username}
              </span>
            )}
            <input
              id="username"
              name="username"
              className="form__input form__input--text"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              data-cy="username"
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="password">
            <span className="form__labeling">Password</span>

            {error.password && (
              <span className="form__error" data-cy="error">
                {error.password}
              </span>
            )}
            <input
              id="password"
              name="password"
              className="form__input form__input--text"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              data-cy="password"
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="confirm">
            <span className="form__labeling">Confirm Password</span>
            {error.confirm && (
              <span className="form__error" data-cy="error">
                {error.confirm}
              </span>
            )}
            <input
              id="confirm"
              name="confirmPassword"
              className="form__input form__input--text"
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(evt) => setConfirm(evt.target.value)}
              data-cy="confirm"
            />
          </label>
        </fieldset>

        <button
          className="btn btn--submit btn--small"
          type="submit"
          data-cy="submit"
          disabled={requesting}
        >
          {requesting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
