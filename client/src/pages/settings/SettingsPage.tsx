import { createRef, useState, useEffect, SyntheticEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reactRedux';
import { ajaxRequest } from '../../utils/utils';
import { updateUser } from '../../reducers/userReducer';
import './styles/settingsPage.css';

const AccountForm = ({
  currentUsername,
  currentEmail,
  currentImage,
  updateUserData,
}: {
  currentUsername: string;
  currentEmail: string;
  currentImage: string;
  updateUserData: (data: any) => void;
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<{
    username?: string;
    email?: string;
  }>({});
  const fileRef = createRef<HTMLInputElement>();

  // Timeout for clearing notification message
  useEffect(() => {
    let notificationTimer: number;
    if (notification)
      notificationTimer = window.setTimeout(() => {
        setNotification(null);
      }, 5000);

    return () => {
      if (notificationTimer) clearTimeout(notificationTimer);
    };
  }, [notification]);

  const submitForm = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setSubmitting(true);
    setNotification(null);
    setError({});

    const formData = new FormData();

    if (username) formData.append('username', username);
    if (email) formData.append('email', email);

    ajaxRequest('/api/settings/account', 'POST', formData, {
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

  const onSubmitProfileImage = (file: any, remove = false) => {
    setError({});
    const formData = new FormData();

    if (file) formData.append('profileImage', file);
    if (remove) formData.append('remove', remove ? 'true' : 'false');

    ajaxRequest('/api/settings/account', 'POST', formData, {
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
            onClick={() => (fileRef.current ? fileRef.current.click() : null)}
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
            onChange={(evt) =>
              evt.target.files
                ? onSubmitProfileImage(evt.target.files[0])
                : null
            }
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
            name="username"
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
            name="email"
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
        <button className="btn btn--submit" type="submit" disabled={submitting}>
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
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
  }>({});
  const [notification, setNotification] = useState<string | null>(null);

  // Timeout for clearing notification message
  useEffect(() => {
    let notificationTimer: number;
    if (notification)
      notificationTimer = window.setTimeout(() => {
        setNotification(null);
      }, 5000);

    return () => {
      clearTimeout(notificationTimer);
    };
  }, [notification]);

  const submitForm = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setSubmitting(true);
    setNotification(null);
    setError({});

    ajaxRequest('/api/settings/password', 'POST', {
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

const SettingsPage = () => {
  const user = useAppSelector((state) => state.user);
  const { type } = useParams();
  let displayedForm;

  switch (type) {
    case 'account':
      displayedForm = (
        <AccountForm
          currentUsername={user.username}
          currentEmail={user.email}
          currentImage={user.profileImage}
          updateUserData={updateUser}
        />
      );
      break;
    case 'password':
      displayedForm = user.oauthUser ? (
        <form className="settings__form settings__form--oauth">
          <h2>Unable to update password for Github User</h2>
        </form>
      ) : (
        <PasswordForm />
      );
      break;

    default:
      displayedForm = <Navigate to="/settings/account" />;
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

export default SettingsPage;
