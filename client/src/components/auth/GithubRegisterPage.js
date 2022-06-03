import * as React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUserData } from '../../actions/authentication';
import { validateUsername, ajaxRequest } from '../../utils/utils';

const GithubPage = (props) => {
  const [username, setUsername] = React.useState('');
  const [validation, setValidation] = React.useState({});
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Check if user is logged in with no username
  if (
    !props.user.authenticating &&
    (!props.user.authenticated || props.user.username)
  ) {
    return <Navigate to="/challenges" />;
  }

  const onSubmit = (evt) => {
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
        props.setUserData(res.data.user);
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

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch(setUserData(data)),
});

GithubPage.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    authenticated: PropTypes.bool,
    authenticating: PropTypes.bool,
  }).isRequired,
  setUserData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GithubPage);
