import { QueryClient } from '@tanstack/react-query';

/**
 * Configuration du QueryClient pour TanStack Query
 * Gère le cache, les retry et le refetch des données
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - Les données sont considérées comme fraîches pendant 5min
      gcTime: 1000 * 60 * 30, // 30 minutes - Garbage collection après 30min d'inactivité
      retry: 1, // Réessayer 1 fois en cas d'échec
      refetchOnWindowFocus: false, // Ne pas refetch automatiquement au focus de la fenêtre
      refetchOnReconnect: true, // Refetch lors de la reconnexion internet
    },
    mutations: {
      retry: 0, // Ne pas réessayer les mutations en cas d'échec
    },
  },
});
