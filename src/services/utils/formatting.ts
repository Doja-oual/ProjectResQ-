import { IncidentSeverity, AmbulanceStatus, IncidentStatus } from '../../types';

/**
 * Formate une date ISO en format lisible
 * @param isoDate - Date au format ISO 8601
 * @param includeTime - Inclure l'heure dans le format
 * @returns Date formatée
 */
export function formatDate(isoDate: string, includeTime = true): string {
  const date = new Date(isoDate);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  if (includeTime) {
    return date.toLocaleDateString('fr-FR', { ...dateOptions, ...timeOptions });
  }

  return date.toLocaleDateString('fr-FR', dateOptions);
}

/**
 * Calcule le temps écoulé depuis une date
 * @param isoDate - Date au format ISO 8601
 * @returns Temps écoulé en format lisible
 */
export function timeAgo(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'À l\'instant';
}

/**
 * Formate un numéro de téléphone
 * @param phoneNumber - Numéro de téléphone
 * @returns Numéro formaté
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Supprime tous les caractères non numériques
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format marocain: +212-6-XX-XX-XX-XX
  if (cleaned.startsWith('212')) {
    const match = cleaned.match(/^(\d{3})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]}-${match[2]}-${match[3]}-${match[4]}-${match[5]}-${match[6]}`;
    }
  }

  return phoneNumber; // Retourne tel quel si pas de match
}

/**
 * Obtient la couleur associée à la gravité d'un incident
 * @param severity - Gravité de l'incident
 * @returns Classe Tailwind pour la couleur
 */
export function getSeverityColor(severity: IncidentSeverity): string {
  const colors = {
    [IncidentSeverity.LOW]: 'text-green-600 bg-green-50 border-green-200',
    [IncidentSeverity.MEDIUM]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [IncidentSeverity.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
    [IncidentSeverity.CRITICAL]: 'text-red-600 bg-red-50 border-red-200',
  };

  return colors[severity] || colors[IncidentSeverity.LOW];
}

/**
 * Obtient la couleur associée au statut d'une ambulance
 * @param status - Statut de l'ambulance
 * @returns Classe Tailwind pour la couleur
 */
export function getAmbulanceStatusColor(status: AmbulanceStatus): string {
  const colors = {
    [AmbulanceStatus.AVAILABLE]: 'text-green-600 bg-green-50 border-green-200',
    [AmbulanceStatus.BUSY]: 'text-red-600 bg-red-50 border-red-200',
    [AmbulanceStatus.MAINTENANCE]: 'text-gray-600 bg-gray-50 border-gray-200',
    [AmbulanceStatus.OFFLINE]: 'text-slate-600 bg-slate-50 border-slate-200',
  };

  return colors[status] || colors[AmbulanceStatus.OFFLINE];
}

/**
 * Obtient la couleur associée au statut d'un incident
 * @param status - Statut de l'incident
 * @returns Classe Tailwind pour la couleur
 */
export function getIncidentStatusColor(status: IncidentStatus): string {
  const colors = {
    [IncidentStatus.PENDING]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [IncidentStatus.ASSIGNED]: 'text-blue-600 bg-blue-50 border-blue-200',
    [IncidentStatus.IN_PROGRESS]: 'text-orange-600 bg-orange-50 border-orange-200',
    [IncidentStatus.COMPLETED]: 'text-green-600 bg-green-50 border-green-200',
    [IncidentStatus.CANCELLED]: 'text-gray-600 bg-gray-50 border-gray-200',
  };

  return colors[status] || colors[IncidentStatus.PENDING];
}

/**
 * Obtient le label français pour un statut d'ambulance
 */
export function getAmbulanceStatusLabel(status: AmbulanceStatus): string {
  const labels = {
    [AmbulanceStatus.AVAILABLE]: 'Disponible',
    [AmbulanceStatus.BUSY]: 'Occupée',
    [AmbulanceStatus.MAINTENANCE]: 'Maintenance',
    [AmbulanceStatus.OFFLINE]: 'Hors service',
  };

  return labels[status] || status;
}

/**
 * Obtient le label français pour un statut d'incident
 */
export function getIncidentStatusLabel(status: IncidentStatus): string {
  const labels = {
    [IncidentStatus.PENDING]: 'En attente',
    [IncidentStatus.ASSIGNED]: 'Assigné',
    [IncidentStatus.IN_PROGRESS]: 'En cours',
    [IncidentStatus.COMPLETED]: 'Terminé',
    [IncidentStatus.CANCELLED]: 'Annulé',
  };

  return labels[status] || status;
}

/**
 * Obtient le label français pour une gravité d'incident
 */
export function getSeverityLabel(severity: IncidentSeverity): string {
  const labels = {
    [IncidentSeverity.LOW]: 'Faible',
    [IncidentSeverity.MEDIUM]: 'Moyenne',
    [IncidentSeverity.HIGH]: 'Élevée',
    [IncidentSeverity.CRITICAL]: 'Critique',
  };

  return labels[severity] || severity;
}
