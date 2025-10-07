import { Menu, Github, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gray-900 shadow-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold text-gray-100">
                Pi Server Setup Guide
              </h1>
              <p className="text-sm text-gray-400 hidden sm:block">
                Interactive showcase of production-ready Raspberry Pi server setup
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/escowin/pi-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Github className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://escowin.github.io/pi-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Live Demo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
