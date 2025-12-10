import React from 'react';
import { Guest } from '../types';
import { User, CreditCard, Mail, Car, Calendar, Clock, Upload, ArrowRight, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';

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
    // Recalculate duration
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Guest Details</h2>
            <p className="text-sm text-gray-500">Guest {index + 1} of {totalGuests} • Unit {unitNumber}</p>
        </div>
        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
            {index + 1} / {totalGuests}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Info */}
        <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
            <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={guest.name}
                    onChange={(e) => updateGuest('name', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="John Doe"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">ID / Passport</label>
            <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={guest.idNumber}
                    onChange={(e) => updateGuest('idNumber', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="Identity Number"
                />
            </div>
        </div>

        <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase">Contact Number</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="tel" 
                    value={guest.contactNumber}
                    onChange={(e) => updateGuest('contactNumber', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="+27 12 345 6789"
                />
            </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-4 md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Vehicle & Parking</h3>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Make & Model</label>
            <div className="relative">
                <Car className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={guest.vehicleMake}
                    onChange={(e) => updateGuest('vehicleMake', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="Toyota Corolla"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Registration</label>
            <input 
                type="text" 
                value={guest.vehicleReg}
                onChange={(e) => updateGuest('vehicleReg', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                placeholder="ABC 123 GP"
            />
        </div>

        <div className="space-y-1 md:col-span-2">
             <label className="text-xs font-medium text-gray-500 uppercase">Parking Bay</label>
            <input 
                type="text" 
                value={guest.parkingBay}
                onChange={(e) => updateGuest('parkingBay', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                placeholder="Bay 42 (Optional)"
            />
        </div>

        {/* Dates */}
        <div className="space-y-4 md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Stay Duration</h3>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Check-in</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="date" 
                    value={guest.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('checkIn', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Check-out</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                    type="date" 
                    value={guest.checkOut}
                    min={guest.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                    className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
            </div>
        </div>

        {guest.duration && (
            <div className="md:col-span-2 bg-brand-50 border border-brand-100 rounded-lg p-3 flex items-center text-brand-700 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Total Stay: {guest.duration}</span>
            </div>
        )}

        {/* Document Upload */}
        <div className="space-y-4 md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Identification Document</h3>
        </div>

        <div className="md:col-span-2">
            <div className={`border-2 border-dashed rounded-xl p-6 transition-colors text-center ${guest.idDocument ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'}`}>
                <input 
                    type="file" 
                    id="id-upload" 
                    className="hidden" 
                    accept=".pdf,image/*" 
                    onChange={handleFileUpload} 
                />
                
                {guest.idDocument ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium text-green-800">{guest.idDocument.name}</p>
                        <button 
                            onClick={() => updateGuest('idDocument', null)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                        >
                            <Trash2 className="w-3 h-3 mr-1" /> Remove
                        </button>
                    </div>
                ) : (
                    <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Upload ID or Passport</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG accepted</p>
                    </label>
                )}
            </div>
        </div>

      </div>

      <div className="flex gap-4 pt-4">
        <button
            onClick={onPrev}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
            onClick={onNext}
            disabled={!isValid}
            className="flex-[2] py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {index === totalGuests - 1 ? 'Next: Upload Template' : 'Next Guest'}
            <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default StepGuestDetails;