import React from 'react';
import { Users, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  unitNumber: string;
  setUnitNumber: (val: string) => void;
  guestCount: string;
  setGuestCount: (val: string) => void;
  onNext: () => void;
}

const StepInitial: React.FC<Props> = ({ unitNumber, setUnitNumber, guestCount, setGuestCount, onNext }) => {
  const isValid = unitNumber.trim().length > 0 && parseInt(guestCount) > 0 && parseInt(guestCount) <= 20;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-2">
            <Users className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Tenke Ingenuity</h2>
        <p className="text-gray-500">Let's start the guest registration process.</p>
      </div>

      <div className="max-w-md mx-auto space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Unit Number</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 1112"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="1"
              max="20"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="How many guests?"
            />
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full flex items-center justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default StepInitial;