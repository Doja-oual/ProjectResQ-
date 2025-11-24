import type { Coordinates } from '../../types';


export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Rayon de la Terre en km

  const lat1Rad = toRadians(coord1.latitude);
  const lat2Rad = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.longitude - coord1.longitude);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return Math.round(distance * 100) / 100; // Arrondi à 2 décimales
}

/**
 * Convertit des degrés en radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estime le temps d'arrivée en fonction de la distance
 * Vitesse moyenne estimée : 60 km/h en ville
 * @param distanceKm - Distance en kilomètres
 * @returns Temps estimé en minutes
 */
export function calculateETA(distanceKm: number): number {
  const avgSpeedKmH = 60; // Vitesse moyenne en km/h
  const timeHours = distanceKm / avgSpeedKmH;
  const timeMinutes = timeHours * 60;

  return Math.ceil(timeMinutes); // Arrondi au supérieur
}

/**
 * Trouve l'ambulance la plus proche d'un incident
 * @param incidentCoords - Coordonnées de l'incident
 * @param ambulances - Liste des ambulances disponibles avec leurs coordonnées
 * @returns ID de l'ambulance la plus proche et sa distance
 */
export function findNearestAmbulance(
  incidentCoords: Coordinates,
  ambulances: Array<{ id: string; currentLocation: Coordinates }>
): { ambulanceId: string; distance: number } | null {
  if (ambulances.length === 0) return null;

  let nearest = {
    ambulanceId: ambulances[0].id,
    distance: calculateDistance(incidentCoords, ambulances[0].currentLocation)
  };

  for (let i = 1; i < ambulances.length; i++) {
    const distance = calculateDistance(incidentCoords, ambulances[i].currentLocation);
    if (distance < nearest.distance) {
      nearest = {
        ambulanceId: ambulances[i].id,
        distance
      };
    }
  }

  return nearest;
}

/**
 * Formate une distance pour l'affichage
 * @param distanceKm - Distance en kilomètres
 * @returns Distance formatée avec unité
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
