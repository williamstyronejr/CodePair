const GithubButton = ({ signIn = false }: { signIn?: boolean }) => (
  <div className="btn btn--social">
    <a className="github-link" href="/auth/github/callback" data-cy="github">
      <span className="flex-wrapper flex-wrapper--center">
        {signIn ? 'Log in with Github' : 'Sign up with Github'}
        <i className="devicon-github-original-wordmark github-logo" />
      </span>
    </a>
  </div>
);

export default GithubButton;
