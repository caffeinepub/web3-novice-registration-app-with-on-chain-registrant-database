import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Registrant, PublicRegistrant, Sector } from '../backend';
import { Principal } from '@dfinity/principal';

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetRegistrant(principal?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Registrant | null>({
    queryKey: ['registrant', principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getRegistrant(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useAddRegistrant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrant: Registrant) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRegistrant(registrant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrant'] });
      queryClient.invalidateQueries({ queryKey: ['allRegistrants'] });
      queryClient.invalidateQueries({ queryKey: ['registrantCount'] });
      queryClient.invalidateQueries({ queryKey: ['publicRegistrants'] });
    },
  });
}

export function useListAllRegistrants() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Registrant[]>({
    queryKey: ['allRegistrants'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllRegistrants();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchRegistrants(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Registrant[]>({
    queryKey: ['searchRegistrants', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return actor.listAllRegistrants();
      return actor.searchRegistrants(searchTerm);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteRegistrant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRegistrant(Principal.fromText(principal));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRegistrants'] });
      queryClient.invalidateQueries({ queryKey: ['searchRegistrants'] });
      queryClient.invalidateQueries({ queryKey: ['registrantCount'] });
      queryClient.invalidateQueries({ queryKey: ['publicRegistrants'] });
    },
  });
}

export function useGetRegistrantCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['registrantCount'],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getTotalNumberOfRegistrants();
      return Number(count);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000,
    retry: false,
  });
}

export function useGetPublicRegistrantsBySector(sector: Sector | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicRegistrant[]>({
    queryKey: ['publicRegistrants', sector],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicRegistrantsBySector(sector);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
