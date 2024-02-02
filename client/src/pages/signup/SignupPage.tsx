import { SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';
import GithubButton from '../auth/GithubButton';
import Input from '../../components/shared/Input';
import useUserContext from '../../hooks/context/useUserContext';
import useSignup from '../../hooks/api/useSignup';
import './styles/signupPage.css';

const SignupPage = () => {
  const user = useUserContext();
  const { mutate, isPending, error, data } = useSignup();

  if (user) return <Navigate to="/challenges" />;

  function onSubmit(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const username = formData.get('username') as string;
    const confirm = formData.get('confirmPassword') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutate({ username, password, confirm, email });
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

        {error ? (
          <div className="form__error">
            An error occurred during request, please try again
          </div>
        ) : null}

        <fieldset className="form__field">
          <Input
            name="email"
            type="text"
            label="Email"
            error={data && data.errors ? data.errors.email : null}
          />
          <Input
            type="text"
            name="username"
            label="Username"
            error={data && data.errors ? data.errors.username : null}
          />
          <Input
            type="password"
            name="password"
            label="Password"
            error={data && data.errors ? data.errors.password : null}
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            error={data && data.errors ? data.errors.confirm : null}
          />
        </fieldset>

        <button
          className="btn btn--submit btn--auth"
          type="submit"
          data-cy="submit"
          disabled={isPending}
        >
          {isPending ? (
            <i className="fas fa-spinner fa-spin spinner-space" />
          ) : null}
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
