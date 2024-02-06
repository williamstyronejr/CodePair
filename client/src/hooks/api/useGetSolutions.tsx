import { useInfiniteQuery } from '@tanstack/react-query';

export default function useGetSolutions({ username }: { username: string }) {
  return useInfiniteQuery({
    queryKey: ['get", "solutions', username],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/user/${username}/profile/solutions?page=${pageParam}`
      );

      if (res.ok) return (await res.json()).solutions as any[];

      throw new Error('An error occurred during request, please try again.');
    },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParmas) => {
      return lastPage.length !== 0 ? lastPageParam + 1 : null;
    },
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => {
      return firstPageParam !== 1 ? firstPageParam - 1 : null;
    },
  });
}
