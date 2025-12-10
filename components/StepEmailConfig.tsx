import React from 'react';
import { Mail, Send, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Final Review</h2>
        <p className="text-gray-500">Configure email settings and send.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex gap-3 text-sm text-yellow-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
                The PDFs will be generated in your browser. The backend service will simply relay the email.
            </p>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Recipients (Comma separated)</label>
            <textarea
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
                placeholder="reception@hotel.com, manager@hotel.com"
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono"
            />
        </div>

        <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700">Email Subject Line</label>
             <input
                type="text"
                value={customHeading}
                onChange={(e) => setCustomHeading(e.target.value)}
                placeholder="Auto-generated if left blank"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
             />
             <p className="text-xs text-gray-500">Preview: <span className="font-semibold text-gray-700">{generateHeading()}</span></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Processing Summary</h4>
            <ul className="text-sm text-gray-600 space-y-1">
                <li>• Unit: <strong>{unitNumber}</strong></li>
                <li>• Guests: <strong>{guests.length}</strong></li>
                <li>• Documents to Generate: <strong>{guests.length} Form(s)</strong></li>
                <li>• Attachments: <strong>{guests.length} ID(s)</strong></li>
            </ul>
        </div>

        <div className="flex gap-4 pt-4">
            <button
                onClick={onPrev}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <button
                onClick={onProcess}
                disabled={isProcessing}
                className="flex-[2] py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-brand-500/30"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating PDFs...
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
  );
};

export default StepEmailConfig;