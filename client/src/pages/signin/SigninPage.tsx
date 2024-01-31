import { useState } from 'react';
import { SyntheticEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import GithubButton from '../auth/GithubButton';
import { setUserData } from '../../reducers/userReducer';
import { ajaxRequest } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../hooks/reactRedux';
import './styles/signinPage.css';

const SigninPage = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(false);

  if (user.authenticated) return <Navigate to="/challenges" />;

  function onSubmit(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (requesting) return;
    setRequesting(true);
    setError(false);

    ajaxRequest('/api/signin', 'POST', { username, password })
      .then((res) => {
        setRequesting(false);
        if (res.data.success) {
          dispatch(setUserData(res.data.user));
        }
      })
      .catch(() => {
        setRequesting(false);
        setError(true);
      });
  }

  return (
    <section className="signin">
      <form className="form" onSubmit={onSubmit}>
        <h1 className="form__heading">Log in to your account</h1>

        <GithubButton signIn />

        <div className="separator">
          <hr />
          <span>Or</span>
          <hr />
        </div>

        {error && (
          <div className="form__error" data-cy="error">
            <p className="">Invalid username or password</p>
          </div>
        )}

        <div className="form__field">
          <label className="form__label" htmlFor="username">
            <span className="form__labeling">Username</span>
            <input
              id="username"
              name="username"
              className="form__input form__input--text"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(evt) => setUser(evt.target.value)}
              data-cy="username"
            />
          </label>
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="password">
            <span className="form__labeling">Password</span>
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
        </div>

        <button
          className="btn btn--submit btn--auth"
          type="submit"
          disabled={requesting}
          data-cy="submit"
        >
          {requesting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Log in
        </button>

        <div className="separator">
          <hr />
        </div>

        <Link to="/recovery" className="signin__recovery" data-cy="recovery">
          Forgot your password?
        </Link>
      </form>
    </section>
  );
};

export default SigninPage;
