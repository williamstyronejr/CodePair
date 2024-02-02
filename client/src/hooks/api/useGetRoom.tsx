import { useQuery } from '@tanstack/react-query';

export default function useGetRoom({
  roomId,
  challengeId,
}: {
  roomId: string;
  challengeId: string;
}) {
  return useQuery({
    queryKey: ['get', 'room', roomId, challengeId],
    queryFn: async () => {
      const res = await fetch(`/api/challenge/${challengeId}/room/${roomId}`);

      if (res.ok) return await res.json();

      throw new Error('An error occurred on the server, please try again.');
    },
  });
}
