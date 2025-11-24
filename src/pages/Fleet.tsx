import { useState } from 'react';
import { useAmbulances } from '../hooks/useAmbulances';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import AddAmbulanceForm from '../components/fleet/AddAmbulanceForm';
import { getAmbulanceStatusLabel } from '../services/utils/formatting';
import { AmbulanceStatus } from '../types';
import { Ambulance, Plus, Search } from 'lucide-react';

export default function Fleet() {
  const { data: ambulances, isLoading } = useAmbulances();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case AmbulanceStatus.AVAILABLE:
        return 'success';
      case AmbulanceStatus.BUSY:
        return 'danger';
      case AmbulanceStatus.MAINTENANCE:
        return 'warning';
      default:
        return 'default';
    }
  };

  // Filter ambulances based on search query
  const filteredAmbulances = ambulances?.filter((ambulance) => {
    const query = searchQuery.toLowerCase();
    return (
      ambulance.vehicleNumber.toLowerCase().includes(query) ||
      ambulance.licensePlate.toLowerCase().includes(query) ||
      ambulance.baseStation.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Gestion de Flotte</h1>
        <Button variant="default" onClick={() => setIsAddDialogOpen(true)} className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-500 font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une Ambulance
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-2xl border-2 border-red-500">
        <div className="p-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            <Input
              type="text"
              placeholder="Rechercher une ambulance (numéro, plaque, station)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-red-200 focus:border-red-500"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : filteredAmbulances && filteredAmbulances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Équipage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Station
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {filteredAmbulances.map((ambulance) => (
                    <tr key={ambulance.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ambulance.vehicleNumber}
                        </div>
                        <div className="text-sm text-gray-500">{ambulance.licensePlate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(ambulance.status)}>
                          {getAmbulanceStatusLabel(ambulance.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {ambulance.crew.length > 0 ? (
                            <div>
                              {ambulance.crew.map((member) => (
                                <div key={member.id} className="text-xs">
                                  {member.firstName} {member.lastName} ({member.role})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Aucun équipage</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ambulance.baseStation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          {ambulance.equipment.length} équipement{ambulance.equipment.length > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Ambulance className="w-16 h-16 text-red-300" />
              </div>
              <p className="text-gray-500">Aucune ambulance trouvée</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Ambulance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Nouvelle Ambulance</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour ajouter une nouvelle ambulance à la flotte.
            </DialogDescription>
          </DialogHeader>
          <AddAmbulanceForm
            onSuccess={() => setIsAddDialogOpen(false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
