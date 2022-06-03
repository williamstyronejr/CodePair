import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from './AppHeader';
import { signoutUser } from '../actions/authentication';

/**
 *  General app layout, handles redirecting user if not authenticated.
 */
const AppLayout = (props) => {
  if (!props.user.authenticated && !props.user.authenticating) {
    return <Navigate to="/signin" />;
  }
  if (props.user.authenticated && !props.user.username) {
    return <Navigate to="/account/register" />;
  }

  return (
    <>
      <Header
        signout={props.signoutUser}
        username={props.user.username}
        profileImage={props.user.profileImage}
      />

      <main className="page-main">{props.children}</main>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  signoutUser: () => dispatch(signoutUser()),
});
AppLayout.propTypes = {
  user: PropTypes.shape({
    profileImage: PropTypes.string,
    username: PropTypes.string,
    authenticated: PropTypes.bool,
    authenticating: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
  signoutUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
