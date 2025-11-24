import { useAmbulances } from '../hooks/useAmbulances';
import { useIncidents } from '../hooks/useIncidents';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AmbulanceStatus, IncidentSeverity, IncidentStatus } from '../types';
import { Ambulance, AlertTriangle, CheckCircle2, Flame, RefreshCw, Siren } from 'lucide-react';

export default function Dashboard() {
  const { data: ambulances, isLoading: ambulancesLoading } = useAmbulances();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();

  const availableAmbulances =
    ambulances?.filter((a) => a.status === AmbulanceStatus.AVAILABLE).length || 0;

  const activeIncidents =
    incidents?.filter(
      (i) =>
        i.status === IncidentStatus.PENDING ||
        i.status === IncidentStatus.ASSIGNED ||
        i.status === IncidentStatus.IN_PROGRESS
    ).length || 0;

  const criticalIncidents =
    incidents?.filter(
      (i) => i.severity === IncidentSeverity.CRITICAL && i.status !== IncidentStatus.COMPLETED
    ).length || 0;

  const completedToday =
    incidents?.filter((i) => i.status === IncidentStatus.COMPLETED).length || 0;

  const isLoading = ambulancesLoading || incidentsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-slate-900 text-white">
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/3 rounded-full bg-red-600/10 blur-3xl" />
        </div>
        <div className="relative space-y-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow">
                Tableau de Bord
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Suivi en temps réel des interventions et ressources disponibles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-white/20 px-3 py-1 text-white border border-white/30">
                {isLoading ? '...' : `${availableAmbulances} ambulances opérationnelles`}
              </span>
              <span className="rounded-full bg-red-500/30 px-3 py-1 text-white border border-red-400/50">
                {isLoading ? '...' : `${activeIncidents} incidents actifs`}
              </span>
              <span className="rounded-full bg-red-600/40 px-3 py-1 text-white border border-red-500/60">
                {isLoading ? '...' : `${criticalIncidents} critiques`}
              </span>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border-2 border-red-500 shadow-xl shadow-red-500/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Ambulance className="w-5 h-5 text-red-600" />
                  </div>
                  Ambulances Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-4xl font-bold text-red-600 drop-shadow">
                  {isLoading ? '...' : availableAmbulances}
                </div>
                <p className="text-xs text-gray-600">Sur {ambulances?.length || 0} au total</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-red-500 shadow-xl shadow-red-500/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  Incidents Actifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-4xl font-bold text-red-600 drop-shadow">
                  {isLoading ? '...' : activeIncidents}
                </div>
                <p className="text-xs text-gray-600">En cours de traitement</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-red-500 shadow-xl shadow-red-500/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-red-600" />
                  </div>
                  Interventions Terminées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-4xl font-bold text-red-600 drop-shadow">
                  {isLoading ? '...' : completedToday}
                </div>
                <p className="text-xs text-gray-600">Aujourd'hui</p>
              </CardContent>
            </Card>
            <Card className="bg-red-600 border-2 border-white shadow-xl shadow-red-700/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  Incidents Critiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-4xl font-bold text-white drop-shadow-lg">
                  {isLoading ? '...' : criticalIncidents}
                </div>
                <p className="text-xs text-white/80">Nécessitent une attention immédiate</p>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white border-2 border-red-500 shadow-2xl shadow-red-500/20">
            <CardHeader className="border-b border-red-200 pb-4 bg-red-50">
              <CardTitle className="text-base font-semibold text-red-600">Activité Récente</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <p className="text-gray-600">Chargement...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100">
                        <Ambulance className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">
                        {availableAmbulances} ambulances disponibles
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100">
                        <RefreshCw className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">
                        {activeIncidents} incidents en cours
                      </span>
                    </div>
                  </div>
                  {criticalIncidents > 0 && (
                    <div className="flex items-center justify-between rounded-lg border-2 border-red-600 bg-red-600 px-4 py-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 animate-pulse">
                          <Siren className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {criticalIncidents} incident{criticalIncidents > 1 ? 's' : ''} critique
                          {criticalIncidents > 1 ? 's' : ''} !
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
