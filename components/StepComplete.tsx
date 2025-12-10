import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  onReset: () => void;
  unitNumber: string;
}

const StepComplete: React.FC<Props> = ({ onReset, unitNumber }) => {
  return (
    <div className="space-y-8 animate-in zoom-in duration-500 text-center py-10">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 ring-8 ring-green-50">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Registration Complete!</h2>
        <p className="text-gray-500 max-w-md mx-auto">
            Documents for Unit {unitNumber} have been successfully processed and the email has been dispatched to the reception.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Start New Registration
      </button>
    </div>
  );
};

export default StepComplete;