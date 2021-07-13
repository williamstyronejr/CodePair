import * as React from 'react';
import PropTypes from 'prop-types';
import '../../styles/loading.css';

const LoadingComponent = ({ message, error }) => {
  if (error) {
    return <div className=""> Error Loading. Please reload page</div>;
  }

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
  error: PropTypes.any,
  message: PropTypes.string,
};

LoadingComponent.defaultProps = {
  error: null,
  message: '',
};

export default LoadingComponent;
