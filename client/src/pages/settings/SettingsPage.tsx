import { createRef, SyntheticEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import useUserContext from '../../hooks/context/useUserContext';
import useUpdatePassword from '../../hooks/api/useUpdatePassword';
import useUpdateAccount from '../../hooks/api/useUpdateAccount';
import Input from '../../components/shared/Input';
import './styles/settingsPage.css';

const AccountForm = ({
  currentUsername,
  currentEmail,
  currentImage,
}: {
  currentUsername: string;
  currentEmail: string;
  currentImage: string;
}) => {
  const { mutate, data, isPending, error } = useUpdateAccount();
  const fileRef = createRef<HTMLInputElement>();

  const submitForm = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    if (formData.get('username') === '') formData.delete('username');
    if (formData.get('email') === '') formData.delete('email');

    mutate({ formData });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitProfileImage = (file: any, remove = false) => {
    const formData = new FormData();

    if (file) formData.append('profileImage', file);
    if (remove) formData.append('remove', remove ? 'true' : 'false');

    mutate({ formData });
  };

  return (
    <form className="settings__form" onSubmit={submitForm}>
      <header className="settings__header">
        {data && data.success ? (
          <p className="settings__notification" data-cy="notification-success">
            Your account has been updated.
          </p>
        ) : null}

        {error ? (
          <p className="settings__notification" data-cy="notification-error">
            An error has occurred on the server, please try again.
          </p>
        ) : null}
      </header>

      <fieldset className="settings__field">
        <label className="settings__label" htmlFor="profileImage">
          <button
            type="button"
            className="btn btn--small"
            disabled={isPending}
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
        <Input
          type="text"
          name="username"
          label="Username"
          placeholder={currentUsername}
          error={data && data.errors ? data.errors.username : null}
        />

        <Input
          type="text"
          name="email"
          label="Email"
          placeholder={currentEmail}
          error={data && data.errors ? data.errors.email : null}
        />
      </fieldset>

      <fieldset className="settings__field">
        <button className="btn btn--submit" type="submit" disabled={isPending}>
          {isPending ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Update
        </button>
      </fieldset>
    </form>
  );
};

const PasswordForm = () => {
  const submitForm = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    mutate({ currentPassword, newPassword, confirmPassword });
  };

  const { data, mutate, isPending, error } = useUpdatePassword();

  return (
    <form className="settings__form" onSubmit={submitForm}>
      <header className="settings__header">
        {data && data.success ? (
          <p className="settings__notification" data-cy="notification-success">
            Successfully updated password.
          </p>
        ) : null}

        {error ? (
          <p className="settings__notification" data-cy="notification-error">
            An error occurred, please try again.
          </p>
        ) : null}
      </header>

      <fieldset className="settings__field">
        <Input
          type="password"
          name="currentPassword"
          label="Current Password"
          error={data && data.errors ? data.errors.currentPassword : null}
        />

        <Input
          type="password"
          name="newPassword"
          label="New Password"
          error={data && data.errors ? data.errors.newPassword : null}
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          error={data && data.errors ? data.errors.confirmPassword : null}
        />
      </fieldset>

      <fieldset className="settings__field">
        <button
          className="btn btn--submit"
          type="submit"
          data-cy="submit"
          disabled={isPending}
        >
          {isPending ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Update Password
        </button>
      </fieldset>
    </form>
  );
};

const SettingsPage = () => {
  const user = useUserContext() as User;
  const { type } = useParams();
  let displayedForm;

  switch (type) {
    case 'account':
      displayedForm = (
        <AccountForm
          currentUsername={user.username}
          currentEmail={user.email}
          currentImage={user.profileImage}
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
