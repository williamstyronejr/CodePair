import * as React from 'react';
import PropTypes from 'prop-types';
import './styles/loading.css';

const LoadingComponent = ({ message }) => {
  return (
    <div className="loading">
      <div className="loading__dots">
        <div />
        <div />
        <div />
        <div />
      </div>
      {message}
    </div>
  );
};

LoadingComponent.propTypes = {
  message: PropTypes.string,
};

LoadingComponent.defaultProps = {
  message: '',
};

export default LoadingComponent;
