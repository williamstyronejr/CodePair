import * as React from 'react';
import PropTypes from 'prop-types';
import './styles/notification.css';

const Notification = ({ type, message }) => (
  <div className={`notification ${type ? `notification--${type}` : ''}`}>
    <h5 className="notification--message">{message}</h5>
  </div>
);

Notification.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
};

Notification.defaultProps = {
  type: '',
  message: '',
};
export default Notification;
