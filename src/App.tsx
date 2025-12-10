import React, { useState } from 'react';
import { AppState, Guest, DEFAULT_EMAIL, API_ENDPOINT } from './types';
import ProgressBar from './components/ProgressBar';
import StepInitial from './components/StepInitial';
import StepGuestDetails from './components/StepGuestDetails';
import StepPdfUpload from './components/StepPdfUpload';
import StepEmailConfig from './components/StepEmailConfig';
import StepComplete from './components/StepComplete';
import { fillGuestForms, fileToBase64 } from './utils/pdfUtils';
import { Download, AlertTriangle, FileText, Sparkles } from 'lucide-react';

const createEmptyGuest = (): Guest => ({
  id: crypto.randomUUID(),
  name: "",
  idNumber: "",
  contactNumber: "",
  vehicleMake: "",
  vehicleReg: "",
  parkingBay: "",
  checkIn: "",
  checkOut: "",
  duration: "",
  idDocument: null,
});

function App() {
  const [state, setState] = useState<AppState>({
    currentStep: 'initial',
    unitNumber: "",
    guestCount: 0,
    guests: [],
    currentGuestIndex: 0,
    pdfTemplate: null,
    emailAddresses: DEFAULT_EMAIL,
    customHeading: "",
    isProcessing: false,
    processingError: null,
    generatedFiles: [],
  });

  const handleInitialNext = () => {
    const count = parseInt(state.guestCount.toString());
    const newGuests = Array(count).fill(null).map((_, i) => state.guests[i] || createEmptyGuest());
    
    setState(prev => ({
      ...prev,
      guests: newGuests,
      currentStep: 'guestInfo',
      currentGuestIndex: 0
    }));
  };

  const handleGuestUpdate = (field: keyof Guest, value: any) => {
    const updatedGuests = [...state.guests];
    updatedGuests[state.currentGuestIndex] = {
      ...updatedGuests[state.currentGuestIndex],
      [field]: value
    };
    setState(prev => ({ ...prev, guests: updatedGuests }));
  };

  const handleGuestNext = () => {
    if (state.currentGuestIndex < state.guests.length - 1) {
      setState(prev => ({ ...prev, currentGuestIndex: prev.currentGuestIndex + 1 }));
      window.scrollTo(0,0);
    } else {
      setState(prev => ({ ...prev, currentStep: 'pdfUpload' }));
    }
  };

  const handleGuestPrev = () => {
    if (state.currentGuestIndex > 0) {
      setState(prev => ({ ...prev, currentGuestIndex: prev.currentGuestIndex - 1 }));
    } else {
      setState(prev => ({ ...prev, currentStep: 'initial' }));
    }
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProcessing = async () => {
    if (!state.pdfTemplate) return;
    setState(prev => ({ ...prev, isProcessing: true, processingError: null, generatedFiles: [] }));

    try {
      const filledPdfs = await fillGuestForms(state.pdfTemplate, state.guests, state.unitNumber);

      const filesToSend: File[] = [...filledPdfs];
      state.guests.forEach(g => {
        if (g.idDocument) {
             const ext = g.idDocument.name.split('.').pop();
             const safeName = `ID_${g.name.replace(/\s+/g, '_')}.${ext}`;
             try {
                filesToSend.push(new File([g.idDocument], safeName, { type: g.idDocument.type }));
             } catch (e) {
                filesToSend.push(g.idDocument);
             }
        }
      });

      setState(prev => ({ ...prev, generatedFiles: filesToSend }));

      const attachments = await Promise.all(filesToSend.map(f => fileToBase64(f)));

      const payload = {
        to: state.emailAddresses.split(',').map(e => e.trim()).filter(Boolean),
        subject: state.customHeading || `Guest Registration - Unit ${state.unitNumber}`,
        html: `
          <h2>Guest Registration Completed</h2>
          <p><strong>Unit:</strong> ${state.unitNumber}</p>
          <p><strong>Guests:</strong> ${state.guests.length}</p>
          <hr/>
          ${state.guests.map((g, i) => `
            <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #4f46e5;">
              <strong>Guest ${i + 1}: ${g.name}</strong><br>
              ID: ${g.idNumber}<br>
              Stay: ${g.checkIn} to ${g.checkOut}
            </div>
          `).join('')}
        `,
        attachments: attachments.map(a => ({
             filename: a.name,
             content: a.content,
             encoding: 'base64'
        }))
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Backend server unavailable or returned error.");
      }

      setState(prev => ({ ...prev, currentStep: 'complete', isProcessing: false }));

    } catch (error: any) {
      console.error("Processing failed:", error);
      setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          processingError: "The email server is currently unavailable. Please download the generated documents below and email them manually." 
      }));
    }
  };

  const handleReset = () => {
    setState({
      currentStep: 'initial',
      unitNumber: "",
      guestCount: 0,
      guests: [],
      currentGuestIndex: 0,
      pdfTemplate: null,
      emailAddresses: DEFAULT_EMAIL,
      customHeading: "",
      isProcessing: false,
      processingError: null,
      generatedFiles: [],
    });
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20 selection:bg-brand-500/30">
      {/* Dark Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Tenke Ingenuity</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Secure Registration System</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300 font-mono">System Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        
        <ProgressBar currentStep={state.currentStep} />

        {state.processingError && (
            <div className="mb-8 space-y-4 animate-slide-up">
                <div className="bg-red-50/90 backdrop-blur border-l-4 border-red-500 p-5 rounded-r-xl shadow-lg flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-4 mt-0.5" />
                    <div>
                        <h3 className="text-red-900 font-bold text-base">Automated Dispatch Failed</h3>
                        <p className="text-red-700 text-sm mt-1 leading-relaxed">{state.processingError}</p>
                    </div>
                </div>

                {state.generatedFiles.length > 0 && (
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Generated Documents</h3>
                            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-md">
                                {state.generatedFiles.length} Files Ready
                            </span>
                        </div>
                        
                        <div className="grid gap-3">
                            {state.generatedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-brand-300 transition-colors shadow-sm group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-brand-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => downloadFile(file)}
                                        className="text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-5 border-t border-slate-200">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipient Addresses</p>
                             <div className="bg-slate-100 p-4 rounded-xl text-sm font-mono text-slate-600 select-all break-all border border-slate-200">
                                {state.emailAddresses}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {state.currentStep === 'initial' && (
          <StepInitial 
            unitNumber={state.unitNumber}
            setUnitNumber={(v) => setState(s => ({ ...s, unitNumber: v }))}
            guestCount={state.guestCount.toString()}
            setGuestCount={(v) => setState(s => ({ ...s, guestCount: parseInt(v) || 0 }))}
            onNext={handleInitialNext}
          />
        )}

        {state.currentStep === 'guestInfo' && state.guests.length > 0 && (
          <StepGuestDetails 
            guest={state.guests[state.currentGuestIndex]}
            index={state.currentGuestIndex}
            totalGuests={state.guests.length}
            unitNumber={state.unitNumber}
            updateGuest={handleGuestUpdate}
            onNext={handleGuestNext}
            onPrev={handleGuestPrev}
          />
        )}

        {state.currentStep === 'pdfUpload' && (
            <StepPdfUpload 
                pdfTemplate={state.pdfTemplate}
                setPdfTemplate={(f) => setState(s => ({...s, pdfTemplate: f}))}
                onNext={() => setState(s => ({...s, currentStep: 'emailConfig'}))}
                onPrev={() => setState(s => ({...s, currentStep: 'guestInfo', currentGuestIndex: state.guests.length - 1}))}
            />
        )}

        {state.currentStep === 'emailConfig' && (
            <StepEmailConfig 
                emailAddresses={state.emailAddresses}
                setEmailAddresses={(v) => setState(s => ({...s, emailAddresses: v}))}
                customHeading={state.customHeading}
                setCustomHeading={(v) => setState(s => ({...s, customHeading: v}))}
                guests={state.guests}
                unitNumber={state.unitNumber}
                isProcessing={state.isProcessing}
                onPrev={() => setState(s => ({...s, currentStep: 'pdfUpload'}))}
                onProcess={handleProcessing}
            />
        )}

        {state.currentStep === 'complete' && (
            <StepComplete 
                unitNumber={state.unitNumber}
                onReset={handleReset}
            />
        )}

      </main>

      <footer className="text-center text-slate-500 text-xs py-6 opacity-60 hover:opacity-100 transition-opacity">
        <p>© {new Date().getFullYear()} Tenke Ingenuity. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;