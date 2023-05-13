import { ReactNode } from 'react';
import { useAppSelector } from '../hooks/reactRedux';
import Loading from '../components/shared/LoadingScreen';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const user = useAppSelector((state) => state.user);

  if (!user.authenticated && user.authenticating) return <Loading />;
  if (!user.authenticated && !user.authenticating)
    return <Navigate to="/signin" />;

  if (user.authenticated && !user.username)
    return <Navigate to="/account/register" />;

  return <>{children}</>;
};

export default ProtectedRoute;
