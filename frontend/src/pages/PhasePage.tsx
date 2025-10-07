import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import { Phase } from '../types';
import StepCard from '../components/StepCard';
import { phases } from '../data/phases';

interface PhasePageProps {
  phase: Phase;
}

export default function PhasePage({ phase }: PhasePageProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const currentPhaseIndex = phases.findIndex(p => p.id === phase.id);
  const nextPhase = phases[currentPhaseIndex + 1];
  const prevPhase = phases[currentPhaseIndex - 1];

  const handleToggleComplete = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const completedCount = completedSteps.length;
  const totalSteps = phase.steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Phase Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{phase.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">{phase.title}</h1>
            <p className="text-gray-400">{phase.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Progress: {completedCount} of {totalSteps} steps completed
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Phase Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-100">Estimated Time</div>
            <div className="text-lg font-semibold text-primary-500">{phase.estimatedTime}</div>
          </div>
          <div className="card text-center">
            <CheckCircle className="h-6 w-6 text-primary-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-100">Difficulty</div>
            <div className={`
              text-lg font-semibold
              ${phase.difficulty === 'Beginner' ? 'text-green-600' :
                phase.difficulty === 'Intermediate' ? 'text-yellow-600' :
                'text-red-600'}
            `}>
              {phase.difficulty}
            </div>
          </div>
          <div className="card text-center">
            <AlertTriangle className="h-6 w-6 text-primary-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-100">Prerequisites</div>
            <div className="text-lg font-semibold text-primary-500">{phase.prerequisites.length} items</div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
            Prerequisites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {phase.prerequisites.map((prereq, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{prereq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-8">
        {phase.steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={{
              ...step,
              completed: completedSteps.includes(step.id)
            }}
            stepNumber={index + 1}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {prevPhase && (
            <Link
              to={`/${prevPhase.id}`}
              className="btn-outline inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous: {prevPhase.title}
            </Link>
          )}
        </div>

        <div className="text-center">
          {completedCount === totalSteps ? (
            <div className="text-green-600 font-medium">
              ✅ Phase completed! Great job!
            </div>
          ) : (
            <div className="text-gray-400">
              {totalSteps - completedCount} steps remaining
            </div>
          )}
        </div>

        <div>
          {nextPhase ? (
            <Link
              to={`/${nextPhase.id}`}
              className="btn-primary inline-flex items-center"
            >
              Next: {nextPhase.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/overview"
              className="btn-primary inline-flex items-center"
            >
              Back to Overview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Completion Message */}
      {completedCount === totalSteps && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Phase {currentPhaseIndex + 1} Complete!
              </h3>
              <p className="text-green-800">
                You've successfully completed all steps in this phase. 
                {nextPhase ? ` Ready to move on to ${nextPhase.title}?` : ' You\'ve completed the entire setup guide!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
