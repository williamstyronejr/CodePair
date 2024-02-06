import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSignout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['user', 'signout'],
    mutationFn: async () => {
      await fetch('/api/signout', { method: 'POST' });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', 'user'] });
    },
  });
}
