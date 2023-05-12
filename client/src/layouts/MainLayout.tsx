import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reactRedux';
import { fetchUserData } from '../reducers/userReducer';
import Header from './Header';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user.authenticated) dispatch(fetchUserData());
  }, []);

  if (user.authenticated && user.username)
    return <Navigate replace to="/challenges" />;

  return (
    <>
      <Header />

      <main className="page-main">{children}</main>
    </>
  );
};

export default MainLayout;
