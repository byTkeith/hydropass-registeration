import React, { useState } from 'react';
import { AppState, Guest, DEFAULT_EMAIL, API_ENDPOINT } from './types';
import ProgressBar from './components/ProgressBar';
import StepInitial from './components/StepInitial';
import StepGuestDetails from './components/StepGuestDetails';
import StepPdfUpload from './components/StepPdfUpload';
import StepEmailConfig from './components/StepEmailConfig';
import StepComplete from './components/StepComplete';
import { fillGuestForms, fileToBase64 } from './utils/pdfUtils';
import { Download, AlertTriangle, FileText } from 'lucide-react';

// Mock Guest Factory
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

  // --- Handlers ---

  const handleInitialNext = () => {
    const count = parseInt(state.guestCount.toString());
    // Create guest array if it doesn't exist or resize it
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
      // 1. Generate PDFs Client Side
      const filledPdfs = await fillGuestForms(state.pdfTemplate, state.guests, state.unitNumber);

      // 2. Prepare Attachments
      // Combine generated forms and uploaded IDs
      const filesToSend: File[] = [...filledPdfs];
      state.guests.forEach(g => {
        if (g.idDocument) {
             // Create a safe filename for the ID document
             const ext = g.idDocument.name.split('.').pop();
             const safeName = `ID_${g.name.replace(/\s+/g, '_')}.${ext}`;
             // Clone the file with new name if possible, or just push original (File name is readonly in some browsers, but we can try new File)
             try {
                filesToSend.push(new File([g.idDocument], safeName, { type: g.idDocument.type }));
             } catch (e) {
                filesToSend.push(g.idDocument);
             }
        }
      });

      // Save to state so user can download if backend fails
      setState(prev => ({ ...prev, generatedFiles: filesToSend }));

      // Convert to Base64 for Email Sending
      const attachments = await Promise.all(filesToSend.map(f => fileToBase64(f)));

      // 3. Construct Payload
      const payload = {
        to: state.emailAddresses.split(',').map(e => e.trim()).filter(Boolean),
        subject: state.customHeading || `Guest Registration - Unit ${state.unitNumber}`,
        html: `
          <h2>Guest Registration Completed</h2>
          <p><strong>Unit:</strong> ${state.unitNumber}</p>
          <p><strong>Guests:</strong> ${state.guests.length}</p>
          <hr/>
          ${state.guests.map((g, i) => `
            <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #0ea5e9;">
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

      // 4. Send to Backend
      // NOTE: This fetch call expects a backend running at API_ENDPOINT
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
                TI
            </div>
            <h1 className="text-xl font-bold text-gray-800">Tenke Ingenuity</h1>
          </div>
          <div className="text-xs text-gray-400 font-mono hidden sm:block">
            V 2.0
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        
        <ProgressBar currentStep={state.currentStep} />

        {state.processingError && (
            <div className="mb-8 space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 font-bold text-sm">Automated Email Failed</h3>
                        <p className="text-red-700 text-sm mt-1">{state.processingError}</p>
                    </div>
                </div>

                {state.generatedFiles.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in slide-in-from-bottom-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Generated Documents</h3>
                        <div className="grid gap-3">
                            {state.generatedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText className="w-5 h-5 text-brand-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => downloadFile(file)}
                                        className="text-sm font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1 hover:underline"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                             <p className="text-sm text-gray-500 mb-2">Please email these documents to:</p>
                             <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-700 select-all">
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

      <footer className="text-center text-gray-400 text-xs py-6">
        <p>© {new Date().getFullYear()} Tenke Ingenuity</p>
      </footer>
    </div>
  );
}

export default App;