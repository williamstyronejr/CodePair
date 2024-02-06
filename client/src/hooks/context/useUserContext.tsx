import { createContext, useContext } from 'react';
import useGetCurrentUser from '../api/useGetCurrentUser';

type State = {
  profileImage: string;
  id: string;
  username: string;
  email: string;
  authenticated: boolean;
  authenticating: boolean;
  authError: string;
  oauthUser: boolean;
};

const UserContext = createContext<State | null>(null);

export function UserContextProvider(props: any) {
  const { data, isError, isPending } = useGetCurrentUser();

  if (isPending) return <div>Loading</div>;

  return <UserContext.Provider value={data} {...props} />;
}

export default function useUserContext() {
  const user = useContext(UserContext);
  // if (!user) throw new Error('UserContext must be inside of UserProvider');
  return user;
}
