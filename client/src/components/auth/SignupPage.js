import * as React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ajaxRequest } from '../../utils/utils';
import { setUserData } from '../../actions/authentication';
import GithubButton from './GithubButton';
import './styles/signupPage.css';

const SignupPage = (props) => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState({});

  if (props.user.authenticated) return <Redirect to="/challenges" />;

  function onSubmit(evt) {
    evt.preventDefault();
    if (requesting) return;

    setRequesting(true);
    setError({});

    ajaxRequest('/signup', 'POST', {
      username: user,
      password,
      confirm,
      email,
    })
      .then((res) => {
        setRequesting(false);
        if (res.data.success) props.setUserData(res.data.user);
      })
      .catch((err) => {
        setRequesting(false);
        if (err.response && err.response.data)
          return setError(err.response.data.errors);
        setError(true);
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
              className="form__input form__input--text"
              type="text"
              placeholder="Username"
              value={user}
              onChange={(evt) => setUser(evt.target.value)}
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

const mapStatesToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserData: (user) => dispatch(setUserData(user)),
});

SignupPage.propTypes = {
  setUserData: PropTypes.func.isRequired,
  user: PropTypes.shape({
    authenticated: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStatesToProps, mapDispatchToProps)(SignupPage);
