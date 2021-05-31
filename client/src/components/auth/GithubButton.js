import * as React from 'react';
import PropTypes from 'prop-types';

const GithubButton = ({ signIn }) => (
  <div className="btn btn--social">
    <a
      className="github-link"
      href="http://localhost:5000/auth/github/callback"
      data-cy="github"
    >
      <span className="flex-wrapper flex-wrapper--center">
        <i className="github-logo devicon-github-plain-wordmark" />
        {signIn ? 'Sign in with Github' : 'Sign up with Github'}
      </span>
    </a>
  </div>
);

GithubButton.propTypes = {
  signIn: PropTypes.bool,
};

GithubButton.defaultProps = {
  signIn: false,
};

export default GithubButton;
