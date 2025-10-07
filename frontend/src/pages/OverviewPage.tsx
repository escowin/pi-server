import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';
import { phases } from '../data/phases';

export default function OverviewPage() {
  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const totalTime = phases.reduce((acc, phase) => {
    const time = parseInt(phase.estimatedTime.split('-')[0]);
    return acc + time;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Setup Overview
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Complete overview of the Raspberry Pi server setup process, including prerequisites, 
          phases, and what you'll accomplish.
        </p>
      </div>

      {/* Quick Stats */}
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

      {/* Prerequisites */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Prerequisites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Hardware Requirements
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">Raspberry Pi 4 Model B (4GB+ RAM recommended)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">64GB+ microSD card (Class 10 or better)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">External storage drive (500GB+ recommended)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">Case with cooling (optional but recommended)</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Software Requirements
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">Raspberry Pi Imager</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">SSH client (Terminal, PuTTY, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">Basic command line knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-300">Router admin access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Setup Phases</h2>
        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="card">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-100">{phase.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${phase.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          phase.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {phase.difficulty}
                      </span>
                      <span className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {phase.estimatedTime}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{phase.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-100 mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.prerequisites.map((prereq, prereqIndex) => (
                        <span key={prereqIndex} className="px-2 py-1 bg-gray-800 text-gray-200 rounded text-xs">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {phase.steps.length} steps
                    </div>
                    <Link
                      to={`/${phase.id}`}
                      className="btn-primary inline-flex items-center"
                    >
                      Start Phase {index + 1}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What You'll Accomplish */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">What You'll Accomplish</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Server Capabilities</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Remote access via HTTPS with DuckDNS dynamic DNS</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Production-ready security with firewall and SSL</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Docker containerization with Portainer management</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Ready for portfolio application hosting</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Automated backups and maintenance</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Technology Stack</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Raspberry Pi OS Lite (64-bit)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Docker + Docker Compose</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">nginx with SSL termination</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">Portainer for Docker management</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-300">UFW firewall, fail2ban, Let's Encrypt SSL</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Important Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Security Considerations</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Change all default passwords</li>
                  <li>• Use SSH key authentication</li>
                  <li>• Configure firewall rules carefully</li>
                  <li>• Keep system and packages updated</li>
                  <li>• Monitor logs regularly</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Best Practices</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Follow phases in order for best results</li>
                  <li>• Test each step before proceeding</li>
                  <li>• Keep backups of important configurations</li>
                  <li>• Document any customizations</li>
                  <li>• Monitor system resources</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="text-center bg-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Begin with Phase 1 to set up your Raspberry Pi with Docker and basic services. 
          Each phase builds upon the previous one, so follow them in order.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/phase-1"
            className="btn-primary inline-flex items-center px-6 py-3 text-lg"
          >
            Start Phase 1
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="https://github.com/yourusername/pi-server"
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
