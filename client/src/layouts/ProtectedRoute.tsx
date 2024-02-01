import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useUserContext from '../hooks/context/useUserContext';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const user = useUserContext();

  if (!user) return <Navigate to="/signin" />;
  if (user && !user.username) return <Navigate to="/account/register" />;

  return <>{children}</>;
};

export default ProtectedRoute;
