import { Routes, Route } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { phases } from './data/phases';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const PhasePage = lazy(() => import('./pages/PhasePage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 lg:ml-64">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/overview" element={<OverviewPage />} />
              {phases.map((phase) => (
                <Route 
                  key={phase.id} 
                  path={`/${phase.id}`} 
                  element={<PhasePage phase={phase} />} 
                />
              ))}
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
