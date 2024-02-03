import { useMutation } from '@tanstack/react-query';

export default function usePublicizeRoom({ roomId }: { roomId: string }) {
  return useMutation({
    mutationKey: ['update', 'room', roomId, 'public'],
    mutationFn: async () => {
      const res = await fetch(`/api/room/${roomId}/public`, { method: 'POST' });

      if (res.ok) return await res.json();

      throw new Error('An error occurred during request, please try again.');
    },
  });
}
