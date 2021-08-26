import * as React from 'react';
import PropTypes from 'prop-types';
import './styles/loading.css';

const Loading = ({ message }) => (
  <div className="loading loading--full">
    <div className="loading__dots">
      <div />
      <div />
      <div />
      <div />
    </div>
    {message}
  </div>
);

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: '',
};

export default Loading;
