import { useMutation } from '@tanstack/react-query';

export default function useUpdatePassword() {
  return useMutation({
    mutationKey: ['update', 'password'],
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const res = await fetch('/api/settings/password', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          password: currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (res.ok) return await res.json();

      if (res.status === 400) {
        const body = await res.json();
        return { errors: body.errors };
      }

      throw new Error('An error occurred during request, please try again');
    },
  });
}
