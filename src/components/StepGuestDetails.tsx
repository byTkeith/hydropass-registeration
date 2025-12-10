import React from 'react';
import { Guest } from '../types';
import { User, CreditCard, Mail, Car, Calendar, Clock, Upload, ArrowRight, ArrowLeft, Trash2, CheckCircle, FileText } from 'lucide-react';

interface Props {
  guest: Guest;
  index: number;
  totalGuests: number;
  unitNumber: string;
  updateGuest: (field: keyof Guest, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepGuestDetails: React.FC<Props> = ({ guest, index, totalGuests, unitNumber, updateGuest, onNext, onPrev }) => {

  const calculateDuration = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return "";
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "Invalid dates";
  };

  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
    updateGuest(field, value);
    const inDate = field === 'checkIn' ? value : guest.checkIn;
    const outDate = field === 'checkOut' ? value : guest.checkOut;
    if (inDate && outDate) {
        updateGuest('duration', calculateDuration(inDate, outDate));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
            updateGuest('idDocument', file);
        } else {
            alert("Invalid file type. Please upload PDF or Image.");
        }
    }
  };

  const isValid = guest.name && guest.idNumber && guest.contactNumber && guest.checkIn && guest.checkOut && guest.idDocument;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between text-white">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Guest Details</h2>
            <p className="text-brand-100/80">Unit {unitNumber}</p>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs uppercase font-bold tracking-wider opacity-70">Guest</span>
            <span className="text-xl font-bold">{index + 1} <span className="text-base font-normal opacity-60">/ {totalGuests}</span></span>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Personal Info */}
        <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Personal Info</h3>
            <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Full Name</label>
            <div className="relative group">
                <User className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={guest.name}
                    onChange={(e) => updateGuest('name', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                    placeholder="e.g. Jane Doe"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">ID / Passport</label>
            <div className="relative group">
                <CreditCard className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={guest.idNumber}
                    onChange={(e) => updateGuest('idNumber', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                    placeholder="Identity Number"
                />
            </div>
        </div>

        <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-slate-500">Contact Number</label>
            <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="tel" 
                    value={guest.contactNumber}
                    onChange={(e) => updateGuest('contactNumber', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                    placeholder="+27..."
                />
            </div>
        </div>

        {/* Vehicle Info */}
        <div className="md:col-span-2 pt-2">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Vehicle & Parking</h3>
            <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Make & Model</label>
            <div className="relative group">
                <Car className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={guest.vehicleMake}
                    onChange={(e) => updateGuest('vehicleMake', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                    placeholder="e.g. Toyota Corolla"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Registration</label>
            <input 
                type="text" 
                value={guest.vehicleReg}
                onChange={(e) => updateGuest('vehicleReg', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                placeholder="e.g. AB 12 XY GP"
            />
        </div>

        <div className="space-y-2 md:col-span-2">
             <label className="text-xs font-medium text-slate-500">Parking Bay</label>
            <input 
                type="text" 
                value={guest.parkingBay}
                onChange={(e) => updateGuest('parkingBay', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                placeholder="Bay Number (Optional)"
            />
        </div>

        {/* Dates */}
        <div className="md:col-span-2 pt-2">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Duration of Stay</h3>
            <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Check-in</label>
            <div className="relative group">
                <Calendar className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="date" 
                    value={guest.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('checkIn', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Check-out</label>
            <div className="relative group">
                <Calendar className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="date" 
                    value={guest.checkOut}
                    min={guest.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-sm transition-all text-slate-800"
                />
            </div>
        </div>

        {guest.duration && (
            <div className="md:col-span-2 bg-brand-50/50 border border-brand-100 rounded-xl p-3 flex items-center text-brand-700 text-sm animate-fade-in">
                <Clock className="w-4 h-4 mr-2 text-brand-500" />
                <span className="font-semibold">Total Stay: {guest.duration}</span>
            </div>
        )}

        {/* Document Upload */}
        <div className="md:col-span-2 pt-2">
             <h3 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Identity Verification</h3>
             <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
        </div>

        <div className="md:col-span-2">
            <div className={`border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer group relative ${guest.idDocument ? 'border-green-400 bg-green-50/30' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}>
                <input 
                    type="file" 
                    id="id-upload" 
                    className="hidden" 
                    accept=".pdf,image/*" 
                    onChange={handleFileUpload} 
                />
                
                {guest.idDocument ? (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{guest.idDocument.name}</p>
                        <p className="text-xs text-slate-500 mb-4">{(guest.idDocument.size / 1024).toFixed(1)} KB</p>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                updateGuest('idDocument', null);
                            }}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center shadow-sm"
                        >
                            <Trash2 className="w-3 h-3 mr-1.5" /> Remove File
                        </button>
                    </div>
                ) : (
                    <label htmlFor="id-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <div className="w-12 h-12 bg-slate-100 group-hover:bg-brand-50 rounded-full flex items-center justify-center mb-3 transition-colors">
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-brand-700">Click to upload ID/Passport</p>
                        <p className="text-xs text-slate-400 mt-1">Supports PDF, JPG, PNG</p>
                    </label>
                )}
            </div>
        </div>

      </div>

      <div className="flex gap-4 pt-2">
        <button
            onClick={onPrev}
            className="flex-1 py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-sm"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
            onClick={onNext}
            disabled={!isValid}
            className="flex-[2] py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:shadow-none"
        >
            {index === totalGuests - 1 ? 'Next: Upload Template' : 'Next Guest'}
            <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default StepGuestDetails;