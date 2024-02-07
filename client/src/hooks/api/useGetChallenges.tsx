import { useInfiniteQuery } from '@tanstack/react-query';

export default function useGetChallenges({
  sortBy,
  search,
}: {
  sortBy: string;
  search: string;
}) {
  return useInfiniteQuery({
    queryKey: ['get', 'challenges', sortBy, search],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await fetch(
        `/api/challenge/list?page=${pageParam}&orderBy=${sortBy}&search=${search}`
      );

      if (res.ok) {
        const body = await res.json();
        return body.challenges as any[];
      }

      throw new Error('An error occurred during request, please try again.');
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      return lastPage.length !== 0 ? lastPageParam + 1 : null;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      return firstPageParam !== 1 ? firstPageParam - 1 : null;
    },
  });
}
