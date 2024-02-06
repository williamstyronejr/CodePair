import { useQuery } from '@tanstack/react-query';

export default function useGetProfile({ username }: { username: string }) {
  return useQuery({
    queryKey: ['get", "profile', username],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/profile/stats`);

      if (res.ok) return await res.json();

      throw new Error('An error occurred during request, please try again.');
    },
  });
}
