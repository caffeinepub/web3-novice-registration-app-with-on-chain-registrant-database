import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserBadge } from '../backend';

export function useGetUserBadge() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserBadge | null>({
    queryKey: ['userBadge'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getOrCreateUserBadge();
      } catch (error: any) {
        console.error('Failed to fetch user badge:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
