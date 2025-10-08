import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import SimpleCodeBlock from './SimpleCodeBlock';
import { Step } from '../types';

interface StepCardProps {
  step: Step;
  stepNumber: number;
  onToggleComplete: (stepId: string) => void;
}

export default function StepCard({ step, stepNumber, onToggleComplete }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">
              {stepNumber}
            </span>
            <h3 className="text-lg font-semibold text-gray-100">{step.title}</h3>
          </div>
          <p className="text-gray-400 mb-4 ml-11">{step.description}</p>
        </div>
        
        <button
          onClick={() => onToggleComplete(step.id)}
          className={`
            ml-4 p-2 rounded-lg transition-colors
            ${step.completed 
              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
              : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
            }
          `}
          title={step.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="ml-11">
        <div className="prose prose-sm max-w-none text-gray-300 mb-4">
          {step.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph}</p>
          ))}
        </div>

        {/* Tips and Warnings */}
        {(step.tips.length > 0 || step.warnings.length > 0) && (
          <div className="mb-4 space-y-2">
            {step.tips.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {step.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {step.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900 mb-1">Warnings</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {step.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Blocks */}
        {step.codeBlocks.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-700 mb-3"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              {isExpanded ? 'Hide' : 'Show'} Code Examples ({step.codeBlocks.length})
            </button>
            
            {isExpanded && (
              <div className="space-y-4">
                {step.codeBlocks.map((codeBlock) => (
                  <SimpleCodeBlock
                    key={codeBlock.id}
                    code={codeBlock.code}
                    language={codeBlock.language}
                    title={codeBlock.title}
                    description={codeBlock.description}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
