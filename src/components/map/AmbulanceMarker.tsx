import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Ambulance } from '../../types';
import { getAmbulanceStatusLabel } from '../../services/utils/formatting';

interface AmbulanceMarkerProps {
  ambulance: Ambulance;
  onClick?: (ambulance: Ambulance) => void;
}

// Create custom ambulance icon
const createAmbulanceIcon = (status: string, heading?: number) => {
  const color = status === 'AVAILABLE' ? '#22c55e' : status === 'BUSY' ? '#ef4444' : '#6b7280';

  const rotation = heading || 0;

  return L.divIcon({
    className: 'custom-ambulance-marker',
    html: `
      <div style="transform: rotate(${rotation}deg); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 18.5C18 19.328 17.328 20 16.5 20C15.672 20 15 19.328 15 18.5C15 17.672 15.672 17 16.5 17C17.328 17 18 17.672 18 18.5Z"/>
          <path d="M7.5 20C8.328 20 9 19.328 9 18.5C9 17.672 8.328 17 7.5 17C6.672 17 6 17.672 6 18.5C6 19.328 6.672 20 7.5 20Z"/>
          <path d="M20 8H17V4H3C1.9 4 1 4.9 1 6V17H3C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17H15C15 18.66 16.34 20 18 20C19.66 20 21 18.66 21 17H23V12L20 8ZM19.5 9.5L21.46 12H17V9.5H19.5Z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export default function AmbulanceMarker({ ambulance, onClick }: AmbulanceMarkerProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(ambulance);
    }
  };

  return (
    <Marker
      position={[ambulance.currentLocation.latitude, ambulance.currentLocation.longitude]}
      icon={createAmbulanceIcon(ambulance.status, ambulance.heading)}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2">{ambulance.vehicleNumber}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-600">Statut :</span>{' '}
              <span className="font-medium">{getAmbulanceStatusLabel(ambulance.status)}</span>
            </div>
            <div>
              <span className="text-gray-600">Plaque :</span>{' '}
              <span className="font-medium">{ambulance.licensePlate}</span>
            </div>
            <div>
              <span className="text-gray-600">Station :</span>{' '}
              <span className="font-medium">{ambulance.baseStation}</span>
            </div>
            {ambulance.crew && ambulance.crew.length > 0 && (
              <div>
                <span className="text-gray-600">Équipage :</span>{' '}
                <span className="font-medium">{ambulance.crew.length} membres</span>
              </div>
            )}
            {ambulance.equipment && (
              <div>
                <span className="text-gray-600">Équipements :</span>{' '}
                <span className="font-medium">{ambulance.equipment.length} items</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
