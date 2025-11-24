import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';

import { store } from './store';
import { queryClient } from './services/api/queryClient';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MapDispatch from './pages/MapDispatch';
import Fleet from './pages/Fleet';
import IncidentHistory from './pages/IncidentHistory';
import NotificationCenter from './components/ui/NotificationCenter';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="map" element={<MapDispatch />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="incidents" element={<IncidentHistory />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <NotificationCenter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
