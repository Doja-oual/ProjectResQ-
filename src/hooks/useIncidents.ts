import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, put, post, del } from '../services/api/client';
import type { Incident } from '../types';

/**
 * Hook pour récupérer tous les incidents
 */
export function useIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: () => get<Incident[]>('/incidents'),
  });
}

/**
 * Hook pour récupérer un incident spécifique par ID
 */
export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => get<Incident>(`/incidents/${id}`),
    enabled: !!id,
  });
}

/**
 * Hook pour créer un nouvel incident
 */
export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incident: Incident) => post<Incident, Incident>('/incidents', incident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

/**
 * Hook pour mettre à jour un incident
 */
export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incident: Incident) =>
      put<Incident, Incident>(`/incidents/${incident.id}`, incident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

/**
 * Hook pour supprimer un incident
 */
export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del(`/incidents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}
