import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useAmbulances } from '../hooks/useAmbulances';
import { useIncidents } from '../hooks/useIncidents';
import type { Ambulance, Incident } from '../types';
import AmbulanceMarker from '../components/map/AmbulanceMarker';
import IncidentMarker from '../components/map/IncidentMarker';
import DispatchPanel from '../components/map/DispatchPanel';
import { MapPin } from 'lucide-react';

// Casablanca coordinates
const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];
const DEFAULT_ZOOM = 12;

export default function MapDispatch() {
  const { data: ambulances, isLoading: ambulancesLoading } = useAmbulances();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();

  const [selectedIncident, setSelectedIncident] = useState<Incident | undefined>();
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | undefined>();

  const handleIncidentSelection = (incident?: Incident) => {
    setSelectedIncident(incident);
    if (incident) {
      setSelectedAmbulance(undefined);
    }
  };

  const handleAmbulanceSelection = (ambulance?: Ambulance) => {
    setSelectedAmbulance(ambulance);
    if (ambulance) {
      setSelectedIncident(undefined);
    }
  };

  const handleIncidentClick = (incident: Incident) => {
    handleIncidentSelection(incident);
  };

  const handleAmbulanceClick = (ambulance: Ambulance) => {
    handleAmbulanceSelection(ambulance);
  };

  const isLoading = ambulancesLoading || incidentsLoading;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-slate-900">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="w-16 h-16 text-white animate-pulse" />
          </div>
          <p className="text-white font-medium">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <MapContainer
        center={CASABLANCA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ambulance Markers */}
        {ambulances?.map((ambulance) => (
          <AmbulanceMarker
            key={ambulance.id}
            ambulance={ambulance}
            onClick={handleAmbulanceClick}
          />
        ))}

        {/* Incident Markers */}
        {incidents?.map((incident) => (
          <IncidentMarker
            key={incident.id}
            incident={incident}
            onClick={handleIncidentClick}
          />
        ))}
      </MapContainer>

      {/* Dispatch Panel */}
      <DispatchPanel
        incidents={incidents || []}
        ambulances={ambulances || []}
        selectedIncident={selectedIncident}
        selectedAmbulance={selectedAmbulance}
        onSelectIncident={handleIncidentSelection}
        onSelectAmbulance={handleAmbulanceSelection}
      />
    </div>
  );
}
