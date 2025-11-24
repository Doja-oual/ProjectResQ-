import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Ambulance, AmbulanceStatus, Coordinates } from '../../types';

interface AmbulancesState {
  ambulances: Ambulance[];
  selectedAmbulanceId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AmbulancesState = {
  ambulances: [],
  selectedAmbulanceId: null,
  loading: false,
  error: null,
};

export const ambulancesSlice = createSlice({
  name: 'ambulances',
  initialState,
  reducers: {
    setAmbulances: (state, action: PayloadAction<Ambulance[]>) => {
      state.ambulances = action.payload;
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

    updateAmbulanceStatus: (
      state,
      action: PayloadAction<{ id: string; status: AmbulanceStatus }>
    ) => {
      const ambulance = state.ambulances.find((a) => a.id === action.payload.id);
      if (ambulance) {
        ambulance.status = action.payload.status;
        ambulance.lastUpdate = new Date().toISOString();
      }
    },

    updateAmbulanceLocation: (
      state,
      action: PayloadAction<{ id: string; location: Coordinates; heading?: number }>
    ) => {
      const ambulance = state.ambulances.find((a) => a.id === action.payload.id);
      if (ambulance) {
        ambulance.currentLocation = action.payload.location;
        if (action.payload.heading !== undefined) {
          ambulance.heading = action.payload.heading;
        }
        ambulance.lastUpdate = new Date().toISOString();
      }
    },

    addAmbulance: (state, action: PayloadAction<Ambulance>) => {
      state.ambulances.push(action.payload);
    },

    removeAmbulance: (state, action: PayloadAction<string>) => {
      state.ambulances = state.ambulances.filter((a) => a.id !== action.payload);
      if (state.selectedAmbulanceId === action.payload) {
        state.selectedAmbulanceId = null;
      }
    },

    selectAmbulance: (state, action: PayloadAction<string | null>) => {
      state.selectedAmbulanceId = action.payload;
    },
  },
});

export const {
  setAmbulances,
  setLoading,
  setError,
  updateAmbulanceStatus,
  updateAmbulanceLocation,
  addAmbulance,
  removeAmbulance,
  selectAmbulance,
} = ambulancesSlice.actions;

export default ambulancesSlice.reducer;
