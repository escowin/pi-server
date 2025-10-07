import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Github, ExternalLink } from 'lucide-react';
import { phases } from '../data/phases';

export default function HomePage() {
  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const totalTime = phases.reduce((acc, phase) => {
    const time = parseInt(phase.estimatedTime.split('-')[0]);
    return acc + time;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
          Raspberry Pi Server
          <span className="block text-primary-500">Setup Guide</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          A comprehensive, interactive guide for setting up a production-ready Raspberry Pi server 
          with Docker, nginx, SSL, and application deployment capabilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/overview"
            className="btn-primary inline-flex items-center px-6 py-3 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="https://github.com/escowin/pi-server"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center px-6 py-3 text-lg"
          >
            <Github className="mr-2 h-5 w-5" />
            View on GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">{phases.length}</div>
          <div className="text-sm text-gray-400">Setup Phases</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">{totalSteps}</div>
          <div className="text-sm text-gray-400">Total Steps</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">{totalTime}+</div>
          <div className="text-sm text-gray-400">Minutes Setup</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">5</div>
          <div className="text-sm text-gray-400">Technologies</div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          What You'll Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-900 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Security</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Production-ready security with firewall, SSL certificates, and intrusion prevention.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• UFW Firewall configuration</li>
              <li>• Let's Encrypt SSL certificates</li>
              <li>• fail2ban intrusion prevention</li>
              <li>• SSH key authentication</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-900 rounded-lg mr-3">
                <Zap className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Performance</h3>
            </div>
            <p className="text-gray-500 mb-4">
              Optimized for performance with Docker containerization and nginx reverse proxy.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Docker containerization</li>
              <li>• nginx reverse proxy</li>
              <li>• Portainer management</li>
              <li>• Automated maintenance</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-900 rounded-lg mr-3">
                <Users className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Accessibility</h3>
            </div>
            <p className="text-gray-500 mb-4">
              Remote access with dynamic DNS and secure VPN connectivity for development.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• DuckDNS dynamic DNS</li>
              <li>• WireGuard VPN setup</li>
              <li>• Remote Git operations</li>
              <li>• Mobile device access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Setup Phases Preview */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          Setup Phases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <Link
              key={phase.id}
              to={`/${phase.id}`}
              className="card hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{phase.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary-400 transition-colors">
                    Phase {index + 1}
                  </h3>
                  <p className="text-sm text-gray-500">{phase.estimatedTime}</p>
                </div>
              </div>
              <h4 className="font-medium text-gray-100 mb-2">{phase.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{phase.description}</p>
              <div className="flex items-center justify-between">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${phase.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    phase.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {phase.difficulty}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: 'Raspberry Pi OS', icon: '🍓' },
            { name: 'Docker', icon: '🐳' },
            { name: 'nginx', icon: '🌐' },
            { name: 'Let\'s Encrypt', icon: '🔒' },
            { name: 'WireGuard', icon: '🔐' },
            { name: 'Portainer', icon: '📊' },
          ].map((tech) => (
            <div key={tech.name} className="card text-center">
              <div className="text-3xl mb-2">{tech.icon}</div>
              <div className="text-sm font-medium text-gray-100">{tech.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Ready to Build Your Server?
        </h2>
        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
          Follow our step-by-step guide to transform your Raspberry Pi into a powerful, 
          production-ready server for hosting applications and managing development workflows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/overview"
            className="btn-primary inline-flex items-center px-6 py-3 text-lg"
          >
            Start Setup Guide
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="https://github.com/escowin/pi-server"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center px-6 py-3 text-lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
}
