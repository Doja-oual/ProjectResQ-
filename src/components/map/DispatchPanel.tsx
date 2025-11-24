import { useMemo, useState } from 'react';
import type { Ambulance, Incident } from '../../types';
import { AmbulanceStatus, IncidentStatus } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getSeverityLabel } from '../../services/utils/formatting';
import {
  calculateDistance,
  calculateETA,
  findNearestAmbulance,
  formatDistance,
} from '../../services/utils/distance';
import { useUpdateIncident } from '../../hooks/useIncidents';
import { useUpdateAmbulance } from '../../hooks/useAmbulances';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../lib/utils';

interface DispatchPanelProps {
  incidents: Incident[];
  ambulances: Ambulance[];
  selectedIncident?: Incident;
  selectedAmbulance?: Ambulance;
  onSelectIncident?: (incident: Incident | undefined) => void;
  onSelectAmbulance?: (ambulance: Ambulance | undefined) => void;
}

export default function DispatchPanel({
  incidents,
  ambulances,
  selectedIncident,
  selectedAmbulance,
  onSelectIncident,
  onSelectAmbulance,
}: DispatchPanelProps) {
  const [activeTab, setActiveTab] = useState<'incidents' | 'ambulances'>('incidents');
  const [processingIncidentId, setProcessingIncidentId] = useState<string | null>(null);

  const updateIncidentMutation = useUpdateIncident();
  const updateAmbulanceMutation = useUpdateAmbulance();
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications();

  const pendingIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          incident.status === IncidentStatus.PENDING || incident.status === IncidentStatus.ASSIGNED
      ),
    [incidents]
  );

  const availableAmbulances = useMemo(
    () => ambulances.filter((ambulance) => ambulance.status === AmbulanceStatus.AVAILABLE),
    [ambulances]
  );

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'BUSY':
        return 'danger';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleIncidentSelection = (incident: Incident) => {
    if (!onSelectIncident) {
      return;
    }
    if (selectedIncident?.id === incident.id) {
      onSelectIncident(undefined);
      return;
    }
    onSelectIncident(incident);
  };

  const handleAmbulanceSelection = (ambulance: Ambulance) => {
    if (!onSelectAmbulance) {
      return;
    }
    if (selectedAmbulance?.id === ambulance.id) {
      onSelectAmbulance(undefined);
      return;
    }
    onSelectAmbulance(ambulance);
  };

  const assignAmbulanceToIncident = async (
    incident: Incident,
    ambulance: Ambulance,
    presetDistance?: number
  ) => {
    if (incident.status !== IncidentStatus.PENDING) {
      notifyInfo('Cet incident est déjà assigné.');
      return;
    }

    if (processingIncidentId) {
      return;
    }

    setProcessingIncidentId(incident.id);

    try {
      const distance =
        typeof presetDistance === 'number'
          ? presetDistance
          : calculateDistance(ambulance.currentLocation, incident.location.coordinates);
      const etaMinutes = calculateETA(distance);
      const timestamp = new Date().toISOString();
      const estimatedArrivalTime = new Date(Date.now() + etaMinutes * 60000).toISOString();

      const updatedIncident: Incident = {
        ...incident,
        assignedAmbulanceId: ambulance.id,
        status: IncidentStatus.ASSIGNED,
        assignedAt: timestamp,
        updatedAt: timestamp,
        estimatedArrivalTime,
        distance,
      };

      const updatedAmbulance: Ambulance = {
        ...ambulance,
        status: AmbulanceStatus.BUSY,
        lastUpdate: timestamp,
      };

      await Promise.all([
        updateIncidentMutation.mutateAsync(updatedIncident),
        updateAmbulanceMutation.mutateAsync(updatedAmbulance),
      ]);

      notifySuccess(`Ambulance ${ambulance.vehicleNumber} assignée avec succès.`);
      onSelectIncident?.(updatedIncident);
      onSelectAmbulance?.(undefined);
    } catch (error) {
      console.error('Assignation error:', error);
      notifyError('Impossible d’assigner l’ambulance. Veuillez réessayer.');
    } finally {
      setProcessingIncidentId(null);
    }
  };

  const handleAutoAssign = (incident: Incident) => {
    if (availableAmbulances.length === 0) {
      notifyWarning('Aucune ambulance disponible pour cet incident.');
      return;
    }

    const nearest = findNearestAmbulance(
      incident.location.coordinates,
      availableAmbulances
    );

    if (!nearest) {
      notifyWarning('Impossible de déterminer l’ambulance la plus proche.');
      return;
    }

    const ambulance = availableAmbulances.find((item) => item.id === nearest.ambulanceId);

    if (!ambulance) {
      notifyWarning('Aucune ambulance disponible pour cet incident.');
      return;
    }

    void assignAmbulanceToIncident(incident, ambulance, nearest.distance);
  };

  const handleManualAssign = (incident: Incident, ambulance: Ambulance) => {
    void assignAmbulanceToIncident(incident, ambulance);
  };

  const isProcessingIncident = (incidentId: string) => processingIncidentId === incidentId;

  return (
    <div className="absolute top-4 right-4 w-96 rounded-lg bg-white shadow-lg overflow-hidden z-1000">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'incidents'
              ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Incidents ({pendingIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab('ambulances')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'ambulances'
              ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Ambulances ({availableAmbulances.length})
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {activeTab === 'incidents' ? (
          <div className="space-y-3 p-4">
            {pendingIncidents.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <div className="mb-2 text-4xl">✓</div>
                <p>Aucun incident en attente</p>
              </div>
            ) : (
              pendingIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                return (
                  <Card
                    key={incident.id}
                    className={cn(
                      'cursor-pointer transition-shadow',
                      isSelected && 'ring-2 ring-primary-500 shadow-md'
                    )}
                    onClick={() => handleIncidentSelection(incident)}
                  >
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="text-sm font-semibold">{incident.title}</h4>
                        <Badge variant={getSeverityVariant(incident.severity)}>
                          {getSeverityLabel(incident.severity)}
                        </Badge>
                      </div>
                      <p className="mb-2 text-xs text-gray-600">{incident.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>{incident.location.city}</div>
                        <div>
                          Patient : {incident.patient.firstName} {incident.patient.lastName}
                        </div>
                        {incident.assignedAmbulanceId && (
                          <div className="mt-1">
                            <Badge variant="info">
                              Assigné : {incident.assignedAmbulanceId}
                            </Badge>
                          </div>
                        )}
                        {incident.distance !== undefined && (
                          <div className="mt-1">
                            Distance : {formatDistance(incident.distance)}
                            {incident.estimatedArrivalTime && (
                              <span className="ml-2">
                                • ETA {new Date(incident.estimatedArrivalTime).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {incident.status === IncidentStatus.PENDING ? (
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          disabled={isProcessingIncident(incident.id)}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAutoAssign(incident);
                          }}
                        >
                          {isProcessingIncident(incident.id)
                            ? 'Assignation...'
                            : 'Assigner automatiquement'}
                        </Button>
                      ) : (
                        <p className="mt-3 text-xs text-gray-400">
                          Incident en cours de traitement
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {availableAmbulances.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <div className="mb-2 text-4xl">🚑</div>
                <p>Aucune ambulance disponible</p>
              </div>
            ) : (
              availableAmbulances.map((ambulance) => {
                const isSelected = selectedAmbulance?.id === ambulance.id;
                const showAssignmentActions =
                  selectedIncident && selectedIncident.status === IncidentStatus.PENDING;
                const distanceToIncident = showAssignmentActions
                  ? calculateDistance(
                      ambulance.currentLocation,
                      selectedIncident.location.coordinates
                    )
                  : undefined;
                const etaToIncident = distanceToIncident !== undefined
                  ? calculateETA(distanceToIncident)
                  : undefined;

                return (
                  <Card
                    key={ambulance.id}
                    className={cn(
                      'cursor-pointer transition-shadow',
                      isSelected && 'ring-2 ring-primary-500 shadow-md'
                    )}
                    onClick={() => handleAmbulanceSelection(ambulance)}
                  >
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="text-sm font-semibold">{ambulance.vehicleNumber}</h4>
                        <Badge variant={getStatusVariant(ambulance.status)}>Disponible</Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div>Plaque : {ambulance.licensePlate}</div>
                        <div>Station : {ambulance.baseStation}</div>
                        {ambulance.crew.length > 0 && (
                          <div>Équipage : {ambulance.crew.length} membres</div>
                        )}
                        {distanceToIncident !== undefined && (
                          <div className="text-gray-600">
                            À {formatDistance(distanceToIncident)} de l’incident sélectionné
                            {etaToIncident !== undefined && (
                              <span className="ml-2">• ETA ~ {etaToIncident} min</span>
                            )}
                          </div>
                        )}
                      </div>
                      {showAssignmentActions && (
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          disabled={
                            !selectedIncident || isProcessingIncident(selectedIncident.id)
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!selectedIncident) {
                              notifyInfo('Sélectionnez un incident à traiter.');
                              return;
                            }
                            handleManualAssign(selectedIncident, ambulance);
                          }}
                        >
                          {selectedIncident && isProcessingIncident(selectedIncident.id)
                            ? 'Assignation...'
                            : 'Assigner à l’incident sélectionné'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
