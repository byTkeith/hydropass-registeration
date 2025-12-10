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
    <div className="space-y-8 animate-slide-up">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white drop-shadow-sm tracking-tight">Tenke Ingenuity</h2>
        <p className="text-brand-100/80 font-medium">Guest Registration Portal</p>
      </div>

      <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Number</label>
            <div className="relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors w-5 h-5" />
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                placeholder="e.g. 1112"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Guests</label>
            <div className="relative group">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors w-5 h-5" />
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                placeholder="Total guests arriving"
              />
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!isValid}
            className="w-full flex items-center justify-center py-4 px-6 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none group mt-2"
          >
            <span>Start Registration</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepInitial;