import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSetUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['set', 'username'],
    mutationFn: async ({ username }: { username: string }) => {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (res.ok) return await res.json();

      if (res.status === 400) {
        const body = await res.json();
        return { success: false, errors: body.errors };
      }

      throw new Error('An error occurred during request, please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', 'user'] });
    },
  });
}
