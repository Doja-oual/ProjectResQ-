import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, put, post, del } from '../services/api/client';
import type { Ambulance } from '../types';

/**
 * Hook pour récupérer toutes les ambulances
 */
export function useAmbulances() {
  return useQuery({
    queryKey: ['ambulances'],
    queryFn: () => get<Ambulance[]>('/ambulances'),
  });
}

/**
 * Hook pour récupérer une ambulance spécifique par ID
 */
export function useAmbulance(id: string) {
  return useQuery({
    queryKey: ['ambulances', id],
    queryFn: () => get<Ambulance>(`/ambulances/${id}`),
    enabled: !!id, // Ne lance la requête que si l'ID existe
  });
}

/**
 * Hook pour mettre à jour une ambulance
 */
export function useUpdateAmbulance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ambulance: Ambulance) =>
      put<Ambulance, Ambulance>(`/ambulances/${ambulance.id}`, ambulance),
    onSuccess: () => {
      // Invalide le cache pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });
}

/**
 * Hook pour créer une nouvelle ambulance
 */
export function useCreateAmbulance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ambulance: Ambulance) =>
      post<Ambulance, Ambulance>('/ambulances', ambulance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });
}

/**
 * Hook pour supprimer une ambulance
 */
export function useDeleteAmbulance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del(`/ambulances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });
}
