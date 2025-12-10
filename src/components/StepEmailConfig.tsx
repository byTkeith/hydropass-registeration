import React from 'react';
import { Mail, Send, ArrowLeft, AlertCircle, Loader2, FileCheck } from 'lucide-react';
import { AppState } from '../types';

interface Props {
  emailAddresses: string;
  setEmailAddresses: (val: string) => void;
  customHeading: string;
  setCustomHeading: (val: string) => void;
  guests: AppState['guests'];
  unitNumber: string;
  isProcessing: boolean;
  onPrev: () => void;
  onProcess: () => void;
}

const StepEmailConfig: React.FC<Props> = ({ 
    emailAddresses, 
    setEmailAddresses, 
    customHeading, 
    setCustomHeading, 
    guests, 
    unitNumber,
    isProcessing,
    onPrev, 
    onProcess 
}) => {

  const generateHeading = () => {
    if (customHeading.trim()) return customHeading;
    const guestNames = guests.map((g) => g.name).filter((name) => name.trim());
    if (guestNames.length === 1) {
        return `Guest Submission - Unit ${unitNumber} - ${guestNames[0]}`;
    } else if (guestNames.length > 1) {
        return `Group Submission - Unit ${unitNumber} - ${guestNames.slice(0, 2).join(", ")}${guestNames.length > 2 ? " & others" : ""}`;
    }
    return `Guest Registration Form - Unit ${unitNumber}`;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white drop-shadow-sm">Final Review</h2>
        <p className="text-brand-100/80 font-medium">Verify details and dispatch emails</p>
      </div>

      <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl">
        
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 p-5 rounded-xl flex gap-4">
                <div className="bg-white p-2 rounded-full h-fit shadow-sm">
                    <AlertCircle className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                    <h4 className="font-bold text-brand-900 text-sm">Browser-Side Generation</h4>
                    <p className="text-xs text-brand-700/80 mt-1 leading-relaxed">
                        Securely generating {guests.length} biometric forms directly on your device before sending via our encrypted relay.
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipients</label>
                <textarea
                    value={emailAddresses}
                    onChange={(e) => setEmailAddresses(e.target.value)}
                    placeholder="reception@hotel.com, manager@hotel.com"
                    rows={3}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm font-mono text-slate-700 leading-relaxed transition-all"
                />
            </div>

            <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Subject</label>
                 <input
                    type="text"
                    value={customHeading}
                    onChange={(e) => setCustomHeading(e.target.value)}
                    placeholder="Auto-generated if left blank"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm font-medium text-slate-800 transition-all"
                 />
                 <div className="px-1 pt-1">
                     <p className="text-xs text-slate-400">Preview: <span className="font-semibold text-brand-600">{generateHeading()}</span></p>
                 </div>
            </div>

            <div className="bg-slate-800 text-slate-200 p-5 rounded-xl shadow-inner">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Unit</span>
                        <span className="font-bold text-white text-lg">{unitNumber}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Total Guests</span>
                        <span className="font-bold text-white text-lg">{guests.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Generated Forms</span>
                        <div className="flex items-center gap-1 font-medium text-emerald-400">
                            <FileCheck className="w-4 h-4" /> {guests.length} PDF(s)
                        </div>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-500">ID Attachments</span>
                         <div className="flex items-center gap-1 font-medium text-emerald-400">
                            <FileCheck className="w-4 h-4" /> {guests.length} File(s)
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={onPrev}
                    disabled={isProcessing}
                    className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-colors flex items-center justify-center disabled:opacity-50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                    onClick={onProcess}
                    disabled={isProcessing}
                    className="flex-[2] py-3.5 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Process & Send
                            <Send className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StepEmailConfig;