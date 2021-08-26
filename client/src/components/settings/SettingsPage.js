import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { ajaxRequest } from '../../utils/utils';
import './styles/settingsPage.css';
import { updateUser } from '../../actions/user';

const AccountForm = ({
  currentUsername,
  currentEmail,
  currentImage,
  updateUserData,
}) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState({});
  const [notification, setNotification] = React.useState(null);
  const fileRef = React.createRef();
  let notificationTimer;

  // Timeout for clearing notification message
  React.useEffect(() => {
    if (notification)
      notificationTimer = setTimeout(() => {
        setNotification(null);
      }, 5000);

    return () => {
      clearTimeout(notificationTimer);
    };
  }, [notification]);

  const submitForm = (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setNotification(null);
    setError({});

    const formData = new FormData();

    if (username) formData.append('username', username);
    if (email) formData.append('email', email);

    ajaxRequest('/settings/account', 'POST', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    })
      .then((res) => {
        setSubmitting(false);
        if (res.data.success) {
          updateUserData(res.data.data);
          return setNotification('Successfully updated user information.');
        }
        setNotification('An error has occurred. Please try again.');
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response.status === 400) {
          setError(err.response.data.errors);
        }
      });
  };

  const onSubmitProfileImage = (file, remove = false) => {
    setError({});
    const formData = new FormData();

    if (file) formData.append('profileImage', file);
    if (remove) formData.append('remove', remove);

    ajaxRequest('/settings/account', 'POST', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    })
      .then((res) => {
        setSubmitting(false);
        if (res.data.success) {
          updateUserData(res.data.data);
          return setNotification('Successfully updated user information.');
        }
        setNotification('An error has occurred. Please try again.');
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response.status === 400) {
          setError(err.response.data.errors);
        }
      });
  };

  return (
    <form className="settings__form" onSubmit={submitForm}>
      <header className="settings__header">
        {notification ? (
          <p className="settings__notification" data-cy="notification">
            {notification}
          </p>
        ) : null}
      </header>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="profileImage">
          <button
            type="button"
            className="btn btn--small"
            disabled={submitting}
            onClick={() => fileRef.current.click()}
          >
            <img src={currentImage} alt="Profile" className="settings__image" />
          </button>

          <span className="settings__title settings__title--center">
            {currentUsername}
          </span>

          <input
            type="file"
            className="settings__input settings__input--file"
            name="profileImage"
            accept="image/jpeg,image/png"
            ref={fileRef}
            onChange={(evt) => onSubmitProfileImage(evt.target.files[0])}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="username">
          <span className="settings__title">Username</span>

          {error.username ? (
            <span className="settings__error" data-cy="error">
              {error.username}
            </span>
          ) : null}

          <input
            id="username"
            type="text"
            className="settings__input settings__input--text"
            data-cy="username"
            value={username}
            placeholder={currentUsername}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="email">
          <span className="settings__title">Email</span>

          {error.email ? (
            <span className="settings__error" data-cy="error">
              {error.email}
            </span>
          ) : null}

          <input
            id="email"
            type="text"
            className="settings__input settings__input--text"
            data-cy="email"
            value={email}
            placeholder={currentEmail}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <button
          className="btn btn--submit"
          type="submit"
          data-cy="submit"
          disabled={submitting}
        >
          {submitting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Update
        </button>
      </fieldset>
    </form>
  );
};

const PasswordForm = () => {
  const [currentPassword, setCurrent] = React.useState('');
  const [newPassword, setNew] = React.useState('');
  const [confirmPassword, setConfirm] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState({});
  const [notification, setNotification] = React.useState(null);
  let notificationTimer;

  // Timeout for clearing notification message
  React.useEffect(() => {
    if (notification)
      notificationTimer = setTimeout(() => {
        setNotification(null);
      }, 5000);

    return () => {
      clearTimeout(notificationTimer);
    };
  }, [notification]);

  const submitForm = (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setNotification(null);
    setError({});

    ajaxRequest('/settings/password', 'POST', {
      password: currentPassword,
      newPassword,
      confirmPassword,
    })
      .then((res) => {
        setSubmitting(false);
        if (res.data.success) {
          setCurrent('');
          setNew('');
          setConfirm('');
          setNotification('Successfully updated password.');
        }
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response.status === 400)
          return setError(err.response.data.errors);
        setNotification('An error has occurred. Please try again.');
      });
  };

  return (
    <form className="settings__form" onSubmit={submitForm}>
      <header className="settings__header">
        {notification ? (
          <p className="settings__notification" data-cy="notification">
            {notification}
          </p>
        ) : null}
      </header>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="password">
          <span className="settings__title">Current Password</span>

          {error.password ? (
            <span className="settings__error" data-cy="error">
              {error.password}
            </span>
          ) : null}

          <input
            id="password"
            className="settings__input settings__input--text"
            type="password"
            data-cy="password"
            value={currentPassword}
            onChange={(evt) => setCurrent(evt.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="newPassword">
          <span className="settings__title">New Password</span>

          {error.newPassword ? (
            <span className="settings__error" data-cy="error">
              {error.newPassword}
            </span>
          ) : null}

          <input
            id="newPassword"
            className="settings__input settings__input--text"
            type="password"
            data-cy="newPassword"
            value={newPassword}
            onChange={(evt) => setNew(evt.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="confirmPassword">
          <span className="settings__title">Confirm Password</span>

          {error.confirmPassword ? (
            <span className="settings__error" data-cy="error">
              {error.confirmPassword}
            </span>
          ) : null}

          <input
            id="confirmPassword"
            className="settings__input settings__input--text"
            type="password"
            data-cy="confirmPassword"
            value={confirmPassword}
            onChange={(evt) => setConfirm(evt.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="settings__field">
        <button
          className="btn btn--submit"
          type="submit"
          data-cy="submit"
          disabled={submitting}
        >
          {submitting ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Update Password
        </button>
      </fieldset>
    </form>
  );
};

const SettingsPage = (props) => {
  const { type } = props.match.params;
  let displayedForm;

  switch (type) {
    case 'account':
      displayedForm = (
        <AccountForm
          currentUsername={props.user.username}
          currentEmail={props.user.email}
          currentImage={props.user.profileImage}
          updateUserData={props.updateUser}
        />
      );
      break;
    case 'password':
      displayedForm = props.user.oauthUser ? (
        <form className="settings__form settings__form--oauth">
          <h2>Unable to update password for Github User</h2>
        </form>
      ) : (
        <PasswordForm />
      );
      break;

    default:
      displayedForm = <Redirect to="/settings/account" />;
  }

  return (
    <section className="settings">
      <aside className="settings__aside">
        <ul className="settings__list">
          <li className="settings__item">
            <Link
              className={`settings__link ${
                type === 'account' ? 'settings__link--active' : ''
              }`}
              to="/settings/account"
            >
              Account
            </Link>
          </li>

          <li className="settings__item">
            <Link
              className={`settings__link ${
                type === 'password' ? 'settings__link--active' : ''
              }`}
              to="/settings/password"
            >
              Password
            </Link>
          </li>
        </ul>
      </aside>

      <div className="settings__content">{displayedForm}</div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(updateUser(data)),
});

AccountForm.propTypes = {
  currentUsername: PropTypes.string.isRequired,
  currentEmail: PropTypes.string.isRequired,
  currentImage: PropTypes.string.isRequired,
  updateUserData: PropTypes.func.isRequired,
};

SettingsPage.propTypes = {
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    profileImage: PropTypes.string,
    oauthUser: PropTypes.bool,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
