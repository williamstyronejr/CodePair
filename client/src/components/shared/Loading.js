import * as React from 'react';
import PropTypes from 'prop-types';
import '../../styles/loading.css';

const LoadingComponent = ({ error }) => {
  if (error) {
    return <div className=""> Error Loading. Please reload page</div>;
  }

  return <div className="loader">Loading</div>;
};

LoadingComponent.propTypes = {
  error: PropTypes.any,
};

LoadingComponent.defaultProps = {
  error: null,
};

export default LoadingComponent;
