import { useMutation } from '@tanstack/react-query';

export default function useTestCode({
  challengeId,
  roomId,
  onSuccess,
}: {
  challengeId: string;
  roomId: string;
  onSuccess: () => void;
}) {
  return useMutation({
    mutationKey: ['update', 'room', 'test', challengeId, roomId],
    mutationFn: async (code: string) => {
      const res = await fetch(
        `/api/challenge/${challengeId}/room/${roomId}/test`,
        {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) return await res.json();

      throw new Error('An error occurred during request, please try again.');
    },
    onSuccess,
  });
}
