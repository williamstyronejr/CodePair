import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSignin() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['user', 'signin'],
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success) return true;
      }

      throw new Error('A server error occurred, please try again.');
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['get', 'user'] });
    },
  });
}
