import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterOptions, MapBounds } from '../../types';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
}

interface UIState {
  filters: FilterOptions;
  mapBounds: MapBounds | null;
  notifications: Notification[];
  sidebarOpen: boolean;
  dispatchPanelOpen: boolean;
}

const initialState: UIState = {
  filters: {},
  mapBounds: null,
  notifications: [],
  sidebarOpen: true,
  dispatchPanelOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },

    updateFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    setMapBounds: (state, action: PayloadAction<MapBounds>) => {
      state.mapBounds = action.payload;
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleDispatchPanel: (state) => {
      state.dispatchPanelOpen = !state.dispatchPanelOpen;
    },

    setDispatchPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.dispatchPanelOpen = action.payload;
    },
  },
});

export const {
  setFilters,
  updateFilters,
  clearFilters,
  setMapBounds,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleDispatchPanel,
  setDispatchPanelOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
