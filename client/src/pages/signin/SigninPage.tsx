import * as React from "react";
import { SyntheticEvent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import GithubButton from "../auth/GithubButton";
import { setUserData } from "../../actions/authentication";
import { ajaxRequest } from "../../utils/utils";
import "./styles/signinPage.css";

const SigninPage = (props: any) => {
  const [username, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState(false);

  if (props.user.authenticated) return <Navigate to="/challenges" />;

  function onSubmit(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (requesting) return;
    setRequesting(true);
    setError(false);

    ajaxRequest("/api/signin", "POST", { username, password })
      .then((res) => {
        setRequesting(false);
        if (res.data.success) {
          props.setUserData(res.data.user);
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
        <h1 className="form__heading">Sign in to your account</h1>

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
          className="btn btn--submit btn--small"
          type="submit"
          disabled={requesting}
          data-cy="submit"
        >
          {requesting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Signin
        </button>

        <hr className="separator" />

        <Link to="/recovery" className="signin__recovery" data-cy="recovery">
          Forgot your password?
        </Link>
      </form>
    </section>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  setUserData: (user: any) => dispatch(setUserData(user)),
});

SigninPage.propTypes = {
  setUserData: PropTypes.func.isRequired,
  user: PropTypes.shape({
    authenticated: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SigninPage);
