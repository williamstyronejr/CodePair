import * as React from 'react';
import PropTypes from 'prop-types';

const GithubButton = ({ signIn }) => (
  <div className="btn btn--social">
    <a className="github-link" href="/auth/github/callback" data-cy="github">
      <span className="flex-wrapper flex-wrapper--center">
        {signIn ? 'Sign in with Github' : 'Sign up with Github'}
        <i className="devicon-github-original-wordmark github-logo" />
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
