import { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from './AppHeader';
import { signoutUser } from '../actions/authentication';

/**
 *  General app layout, handles redirecting user if not authenticated.
 */
const AppLayout = (props: {
  user: {
    profileImage: string;
    username: string;
    authenticated: boolean;
    authenticateing: boolean;
  };
  children: ReactNode;
  signoutUser: () => void;
}) => {
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

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  signoutUser: () => dispatch(signoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
