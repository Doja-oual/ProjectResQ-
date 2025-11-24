import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Incident, IncidentStatus } from '../../types';

interface IncidentsState {
  incidents: Incident[];
  selectedIncidentId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  incidents: [],
  selectedIncidentId: null,
  loading: false,
  error: null,
};

export const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.push(action.payload);
    },

    updateIncident: (state, action: PayloadAction<Incident>) => {
      const index = state.incidents.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
    },

    updateIncidentStatus: (
      state,
      action: PayloadAction<{ id: string; status: IncidentStatus }>
    ) => {
      const incident = state.incidents.find((i) => i.id === action.payload.id);
      if (incident) {
        incident.status = action.payload.status;
      }
    },

    assignAmbulance: (
      state,
      action: PayloadAction<{
        incidentId: string;
        ambulanceId: string;
        distance?: number;
        estimatedArrivalTime?: string;
      }>
    ) => {
      const incident = state.incidents.find((i) => i.id === action.payload.incidentId);
      if (incident) {
        incident.assignedAmbulanceId = action.payload.ambulanceId;
        incident.status = 'ASSIGNED';
        incident.assignedAt = new Date().toISOString();
        if (action.payload.distance !== undefined) {
          incident.distance = action.payload.distance;
        }
        if (action.payload.estimatedArrivalTime) {
          incident.estimatedArrivalTime = action.payload.estimatedArrivalTime;
        }
      }
    },

    unassignAmbulance: (state, action: PayloadAction<string>) => {
      const incident = state.incidents.find((i) => i.id === action.payload);
      if (incident) {
        incident.assignedAmbulanceId = undefined;
        incident.status = 'PENDING';
        incident.assignedAt = undefined;
        incident.distance = undefined;
        incident.estimatedArrivalTime = undefined;
      }
    },

    removeIncident: (state, action: PayloadAction<string>) => {
      state.incidents = state.incidents.filter((i) => i.id !== action.payload);
      if (state.selectedIncidentId === action.payload) {
        state.selectedIncidentId = null;
      }
    },

    selectIncident: (state, action: PayloadAction<string | null>) => {
      state.selectedIncidentId = action.payload;
    },
  },
});

export const {
  setIncidents,
  setLoading,
  setError,
  addIncident,
  updateIncident,
  updateIncidentStatus,
  assignAmbulance,
  unassignAmbulance,
  removeIncident,
  selectIncident,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
