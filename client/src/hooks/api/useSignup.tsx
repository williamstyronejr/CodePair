import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['user', 'signup'],
    mutationFn: async ({
      username,
      password,
      confirm,
      email,
    }: {
      username: string;
      password: string;
      confirm: string;
      email: string;
    }) => {
      const res = await fetch('/api/signup', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, password, confirm, email }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success) return { success: true };
      }

      if (res.status === 400) {
        const body = await res.json();
        return { success: false, errors: body.errors };
      }

      throw new Error('An server error occurred, please try again.');
    },
    onSuccess: (data) => {
      if (data.success)
        queryClient.invalidateQueries({ queryKey: ['get', 'user'] });
    },
  });
}
