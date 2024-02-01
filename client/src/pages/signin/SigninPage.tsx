import { SyntheticEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useUserContext from '../../hooks/context/useUserContext';
import useSignin from '../../hooks/api/useSignin';
import Input from '../../components/shared/Inputs';
import GithubButton from '../auth/GithubButton';
import './styles/signinPage.css';

const SigninPage = () => {
  const user = useUserContext();
  const { mutate, error, isPending } = useSignin();

  if (user) return <Navigate to="/challenges" />;

  function onSubmit(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    mutate({ username, password });
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

        <Input type="text" name="username" label="Username" />
        <Input type="password" name="password" label="Password" />

        <button
          className="btn btn--submit btn--auth"
          type="submit"
          disabled={isPending}
          data-cy="submit"
        >
          {isPending ? (
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
