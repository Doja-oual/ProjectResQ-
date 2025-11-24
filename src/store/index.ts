import { configureStore } from '@reduxjs/toolkit';
import ambulancesReducer from './slices/ambulancesSlice';
import incidentsReducer from './slices/incidentsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    ambulances: ambulancesReducer,
    incidents: incidentsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore ces actions car elles peuvent contenir des dates
        ignoredActions: ['incidents/setIncidents', 'ambulances/setAmbulances'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
