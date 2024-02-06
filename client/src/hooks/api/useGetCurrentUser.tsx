import { useQuery } from '@tanstack/react-query';

export default function useGetCurrentUser() {
  return useQuery({
    retry: false,
    queryKey: ['get', 'user'],
    queryFn: async () => {
      const res = await fetch('/api/user/data');

      if (res.ok) return await res.json();

      throw new Error('');
    },
  });
}
