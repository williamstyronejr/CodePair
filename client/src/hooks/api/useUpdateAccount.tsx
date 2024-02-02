import { useMutation } from '@tanstack/react-query';

export default function useUpdateAccount() {
  return useMutation({
    mutationKey: ['update', 'account'],
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const res = await fetch('/api/settings/account', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) return await res.json();

      if (res.status === 400) {
        const body = await res.json();
        return { errors: body.errors };
      }

      throw new Error('An error occurred during request, please try again.');
    },
  });
}
