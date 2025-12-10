import React from 'react';
import { Step } from '../types';

interface Props {
  currentStep: Step;
}

const steps: { key: Step; label: string; progress: number }[] = [
  { key: 'initial', label: 'Start', progress: 10 },
  { key: 'guestInfo', label: 'Details', progress: 35 },
  { key: 'pdfUpload', label: 'Template', progress: 60 },
  { key: 'emailConfig', label: 'Review', progress: 85 },
  { key: 'complete', label: 'Done', progress: 100 },
];

const ProgressBar: React.FC<Props> = ({ currentStep }) => {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const activeIndex = currentStep === 'processing' ? 3 : currentStepIndex;

  return (
    <div className="w-full mb-10 px-4">
      {/* Labels */}
      <div className="flex justify-between mb-3 text-xs md:text-sm font-medium tracking-wide">
        {steps.filter(s => s.key !== 'processing').map((step, idx) => {
          const isActive = idx <= activeIndex;
          return (
            <span 
              key={step.key} 
              className={`transition-colors duration-500 ${isActive ? 'text-white' : 'text-slate-400'}`}
            >
              {step.label}
            </span>
          );
        })}
      </div>

      {/* Bar Track */}
      <div className="relative h-1.5 bg-slate-700/30 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Active Fill */}
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-brand-600 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out rounded-full"
            style={{ width: `${steps[activeIndex < 0 ? 0 : activeIndex].progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;