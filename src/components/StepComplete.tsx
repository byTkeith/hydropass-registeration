import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  onReset: () => void;
  unitNumber: string;
}

const StepComplete: React.FC<Props> = ({ onReset, unitNumber }) => {
  return (
    <div className="space-y-8 animate-fade-in text-center py-16">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 rounded-full"></div>
        <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl shadow-green-500/40 mb-2">
            <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white drop-shadow-md">All Done!</h2>
        <div className="glass-panel p-6 rounded-2xl max-w-md mx-auto">
            <p className="text-slate-600 text-lg leading-relaxed">
                Registration documents for <strong className="text-slate-900">Unit {unitNumber}</strong> have been generated and the notification email has been dispatched.
            </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center px-8 py-4 bg-white text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Start New Registration
      </button>
    </div>
  );
};

export default StepComplete;