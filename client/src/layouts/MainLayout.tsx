import { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from './Header';

const MainLayout = (props: {
  user: {
    authenticated: boolean;
    username: string;
  };
  children: ReactNode;
}) => {
  if (props.user.authenticated && props.user.username)
    return <Navigate replace to="/challenges" />;

  return (
    <>
      <Header />

      <main className="page-main">{props.children}</main>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MainLayout);
