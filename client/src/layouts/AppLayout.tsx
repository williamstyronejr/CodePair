import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './AppHeader';
import { useAppDispatch, useAppSelector } from '../hooks/reactRedux';
import { signoutUser } from '../reducers/userReducer';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  if (!user.authenticated && !user.authenticating) {
    return <Navigate to="/signin" />;
  }
  if (user.authenticated && !user.username) {
    return <Navigate to="/account/register" />;
  }

  return (
    <>
      <Header
        signout={() => dispatch(signoutUser())}
        username={user.username}
        profileImage={user.profileImage}
      />

      <main className="page-main">{children}</main>
    </>
  );
};

export default AppLayout;
