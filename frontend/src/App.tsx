import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import PhasePage from './pages/PhasePage';
import OverviewPage from './pages/OverviewPage';
import { phases } from './data/phases';

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
        </main>
      </div>
    </div>
  );
}

export default App;
