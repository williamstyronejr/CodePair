import { useState, SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';
import useUserContext from '../../hooks/context/useUserContext';
import useSetUsername from '../../hooks/api/useSetUsername';
import { validateUsername } from '../../utils/utils';

const GithubPage = () => {
  const user = useUserContext() as User;
  const [username, setUsername] = useState('');
  const [validation, setValidation] = useState<{ username?: string }>({});
  const { mutate, isPending, data } = useSetUsername();

  if (user.username) return <Navigate to="/challenge" />;

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setValidation({});

    const userValidation = validateUsername(username);

    if (userValidation)
      return setValidation({ ...validation, username: userValidation });

    mutate({ username });
  };

  return (
    <section>
      <form className="form" method="POST" onSubmit={onSubmit}>
        <h3 className="form__heading">Github User Registration</h3>

        {data && data.errors.username ? (
          <div className="form__error" data-cy="error">
            <p className="">{data.errors.username}</p>
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
          disabled={isPending}
        >
          {isPending ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Set Username
        </button>
      </form>
    </section>
  );
};

export default GithubPage;
