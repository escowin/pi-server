import { Link, useLocation } from 'react-router-dom';
import { X, Home, BookOpen, CheckCircle, Clock, Users } from 'lucide-react';
import { phases } from '../data/phases';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Overview', href: '/overview', icon: BookOpen },
  ];

  const phaseNavigation = phases.map((phase) => ({
    name: phase.title,
    href: `/${phase.id}`,
    icon: CheckCircle,
    meta: {
      estimatedTime: phase.estimatedTime,
      difficulty: phase.difficulty,
    }
  }));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">Navigation</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Phase Navigation */}
            <div className="pt-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Setup Phases
              </h3>
              <div className="space-y-1">
                {phaseNavigation.map((phase, index) => {
                  const isActive = location.pathname === phase.href;
                  return (
                    <Link
                      key={phase.href}
                      to={phase.href}
                      onClick={onClose}
                      className={`
                        block px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{phase.name}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {phase.meta.estimatedTime}
                            <span className="mx-2">•</span>
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs font-medium
                              ${phase.meta.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                phase.meta.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}
                            `}>
                              {phase.meta.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>Built with React + TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
