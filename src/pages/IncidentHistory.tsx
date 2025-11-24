import { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import CreateIncidentForm from '../components/incidents/CreateIncidentForm';
import { getSeverityLabel, getIncidentStatusLabel, formatDate } from '../services/utils/formatting';
import { IncidentSeverity, IncidentStatus } from '../types';
import { FileText, Plus, Filter } from 'lucide-react';

export default function IncidentHistory() {
  const { data: incidents, isLoading } = useIncidents();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL:
        return 'danger';
      case IncidentSeverity.HIGH:
        return 'warning';
      case IncidentSeverity.MEDIUM:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case IncidentStatus.COMPLETED:
        return 'success';
      case IncidentStatus.CANCELLED:
        return 'default';
      case IncidentStatus.IN_PROGRESS:
        return 'warning';
      default:
        return 'info';
    }
  };

  // Filter incidents based on severity and status
  const filteredIncidents = incidents?.filter((incident) => {
    const severityMatch = severityFilter === 'ALL' || incident.severity === severityFilter;
    const statusMatch = statusFilter === 'ALL' || incident.status === statusFilter;
    return severityMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Historique des Incidents</h1>
        <div className="flex gap-2">
          <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="ALL">Toutes les gravités</option>
            <option value={IncidentSeverity.CRITICAL}>Critique</option>
            <option value={IncidentSeverity.HIGH}>Élevée</option>
            <option value={IncidentSeverity.MEDIUM}>Moyenne</option>
            <option value={IncidentSeverity.LOW}>Faible</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Tous les statuts</option>
            <option value={IncidentStatus.PENDING}>En attente</option>
            <option value={IncidentStatus.ASSIGNED}>Assigné</option>
            <option value={IncidentStatus.IN_PROGRESS}>En cours</option>
            <option value={IncidentStatus.COMPLETED}>Terminé</option>
            <option value={IncidentStatus.CANCELLED}>Annulé</option>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-500 font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvel Incident
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              Chargement...
            </CardContent>
          </Card>
        ) : filteredIncidents && filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="bg-white border-2 border-red-500 shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-red-600">
                        {incident.title}
                      </h3>
                      <Badge variant={getSeverityVariant(incident.severity)}>
                        {getSeverityLabel(incident.severity)}
                      </Badge>
                      <Badge variant={getStatusVariant(incident.status)}>
                        {getIncidentStatusLabel(incident.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{incident.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Créé le :</span>
                        <div className="font-medium">{formatDate(incident.createdAt)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Lieu :</span>
                        <div className="font-medium">{incident.location.city}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Patient :</span>
                        <div className="font-medium">
                          {incident.patient.firstName} {incident.patient.lastName}
                        </div>
                      </div>
                      {incident.assignedAmbulanceId && (
                        <div>
                          <span className="text-gray-500">Ambulance :</span>
                          <div className="font-medium">{incident.assignedAmbulanceId}</div>
                        </div>
                      )}
                    </div>

                    {incident.distance && (
                      <div className="mt-2 text-sm text-gray-500">
                        Distance : {incident.distance.toFixed(1)} km
                        {incident.estimatedArrivalTime && (
                          <span className="ml-4">
                            ETA : {formatDate(incident.estimatedArrivalTime)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                      Détails →
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FileText className="w-16 h-16 text-red-300" />
              </div>
              <p className="text-gray-500">Aucun incident trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Incident Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Nouvel Incident</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouvel incident.
            </DialogDescription>
          </DialogHeader>
          <CreateIncidentForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
