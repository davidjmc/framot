import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Navigation } from './components/Navigation/Navigation';
import { AppProvider } from './contexts/AppContext';
import { Home } from './components/Home/Home';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Navigation>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="things/:id" element={<Dashboard />} />
            </Routes>
          </Navigation>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
