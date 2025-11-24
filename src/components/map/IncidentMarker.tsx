import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Incident } from '../../types';
import { IncidentSeverity } from '../../types';
import { getSeverityLabel, getIncidentStatusLabel, formatDate } from '../../services/utils/formatting';

interface IncidentMarkerProps {
  incident: Incident;
  onClick?: (incident: Incident) => void;
}

// Create custom incident icon with severity-based colors
const createIncidentIcon = (severity: string) => {
  const getSeverityColor = () => {
    switch (severity) {
      case IncidentSeverity.CRITICAL:
        return '#ef4444'; // red
      case IncidentSeverity.HIGH:
        return '#f59e0b'; // orange
      case IncidentSeverity.MEDIUM:
        return '#3b82f6'; // blue
      case IncidentSeverity.LOW:
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const color = getSeverityColor();
  const shouldPulse = severity === IncidentSeverity.CRITICAL;

  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div class="relative">
        ${shouldPulse ? `
          <div class="absolute inset-0 animate-ping">
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.4"/>
            </svg>
          </div>
        ` : ''}
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-weight="bold">!</text>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function IncidentMarker({ incident, onClick }: IncidentMarkerProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(incident);
    }
  };

  return (
    <Marker
      position={[incident.location.coordinates.latitude, incident.location.coordinates.longitude]}
      icon={createIncidentIcon(incident.severity)}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="p-2 min-w-[250px]">
          <h3 className="font-bold text-lg mb-2">{incident.title}</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Gravité :</span>{' '}
              <span className="font-medium">{getSeverityLabel(incident.severity)}</span>
            </div>
            <div>
              <span className="text-gray-600">Statut :</span>{' '}
              <span className="font-medium">{getIncidentStatusLabel(incident.status)}</span>
            </div>
            <div>
              <span className="text-gray-600">Description :</span>
              <p className="mt-1 text-gray-700">{incident.description}</p>
            </div>
            <div>
              <span className="text-gray-600">Lieu :</span>{' '}
              <span className="font-medium">
                {incident.location.street}, {incident.location.city}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Patient :</span>{' '}
              <span className="font-medium">
                {incident.patient.firstName} {incident.patient.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Créé le :</span>{' '}
              <span className="font-medium">{formatDate(incident.createdAt)}</span>
            </div>
            {incident.assignedAmbulanceId && (
              <div>
                <span className="text-gray-600">Ambulance assignée :</span>{' '}
                <span className="font-medium">{incident.assignedAmbulanceId}</span>
              </div>
            )}
            {incident.distance && (
              <div>
                <span className="text-gray-600">Distance :</span>{' '}
                <span className="font-medium">{incident.distance.toFixed(1)} km</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
