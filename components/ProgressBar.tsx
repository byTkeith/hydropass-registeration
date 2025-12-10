import React from 'react';
import { Step } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  currentStep: Step;
}

const steps: { key: Step; label: string; progress: number }[] = [
  { key: 'initial', label: 'Unit & Count', progress: 10 },
  { key: 'guestInfo', label: 'Guest Details', progress: 35 },
  { key: 'pdfUpload', label: 'Template', progress: 60 },
  { key: 'emailConfig', label: 'Review & Send', progress: 85 },
  { key: 'complete', label: 'Done', progress: 100 },
];

const ProgressBar: React.FC<Props> = ({ currentStep }) => {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  // If we are processing, show the emailConfig progress
  const activeIndex = currentStep === 'processing' ? 3 : currentStepIndex;

  return (
    <div className="w-full mb-8">
      {/* Labels - Hidden on small mobile */}
      <div className="flex justify-between mb-2 px-2">
        {steps.filter(s => s.key !== 'processing').map((step, idx) => {
          const isActive = idx <= activeIndex;
          return (
            <div 
              key={step.key} 
              className={`flex flex-col items-center ${idx === steps.length - 1 ? '' : 'flex-1'} `}
            >
              <span className={`text-xs md:text-sm font-medium transition-colors duration-300 ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
            className="absolute top-0 left-0 h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${steps[activeIndex < 0 ? 0 : activeIndex].progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;