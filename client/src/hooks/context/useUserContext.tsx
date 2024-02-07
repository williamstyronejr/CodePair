import { createContext, useContext } from 'react';
import useGetCurrentUser from '../api/useGetCurrentUser';

const UserContext = createContext<User | null | undefined>(undefined);

export function UserContextProvider(props: any) {
  const { data, isPending } = useGetCurrentUser();

  if (isPending) return <div>Loading</div>;

  return <UserContext.Provider value={data} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined)
    throw new Error('UserContext must be inside of UserProvider');

  return user;
}
