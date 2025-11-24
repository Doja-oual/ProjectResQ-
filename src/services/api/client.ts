/**
 * Client API pour communiquer avec le backend (JSON Server)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fonction générique pour effectuer des requêtes API
 * @param endpoint - L'endpoint API (ex: '/ambulances')
 * @param options - Options fetch (method, body, headers, etc.)
 * @returns Les données parsées en JSON
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * GET - Récupérer des données
 */
export async function get<T>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: 'GET' });
}

/**
 * POST - Créer une ressource
 */
export async function post<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT - Mettre à jour une ressource complète
 */
export async function put<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH - Mettre à jour partiellement une ressource
 */
export async function patch<T, D = unknown>(
  endpoint: string,
  data: Partial<D>
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE - Supprimer une ressource
 */
export async function del<T>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: 'DELETE' });
}
