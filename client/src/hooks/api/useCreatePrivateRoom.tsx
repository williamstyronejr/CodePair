import { useMutation } from '@tanstack/react-query';

export default function useCreatePrivateRoom() {
  return useMutation({
    mutationKey: ['room', 'create', 'private'],
    mutationFn: async ({
      challengeId,
      language,
    }: {
      challengeId: string;
      language: string;
    }) => {
      const res = await fetch(`/api/challenge/${challengeId}/create`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ language }),
      });

      if (res.ok) return await res.json();

      throw new Error('An error has occurred on server, please try again.');
    },
  });
}
