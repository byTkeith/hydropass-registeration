import React from 'react';
import { FileText, CheckCircle, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react';

interface Props {
  pdfTemplate: File | null;
  setPdfTemplate: (file: File | null) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepPdfUpload: React.FC<Props> = ({ pdfTemplate, setPdfTemplate, onNext, onPrev }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
        setPdfTemplate(file);
    } else {
        alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
       <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white drop-shadow-sm">Form Template</h2>
        <p className="text-brand-100/80 font-medium">Upload the blank Biometric Form PDF</p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className={`relative overflow-hidden border-2 border-dashed rounded-2xl h-72 transition-all duration-300 ease-out flex flex-col items-center justify-center glass-panel ${pdfTemplate ? 'border-green-400/50 bg-green-50/10' : 'border-white/30 hover:border-brand-300/50 hover:bg-white/95'}`}>
            <input 
                type="file" 
                id="template-upload" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleUpload}
            />
            
            {pdfTemplate ? (
                <div className="text-center animate-fade-in z-10 p-6 w-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-lg font-bold text-slate-800 mb-1">{pdfTemplate.name}</p>
                    <p className="text-sm text-slate-500 mb-6 font-mono bg-slate-100 inline-block px-3 py-1 rounded-full">
                        {(pdfTemplate.size / 1024).toFixed(0)} KB
                    </p>
                    <div>
                        <button 
                            onClick={() => setPdfTemplate(null)}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            Remove & Replace
                        </button>
                    </div>
                </div>
            ) : (
                <label htmlFor="template-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center group z-10">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <UploadCloud className="w-10 h-10 text-brand-500" />
                    </div>
                    <p className="text-xl font-bold text-slate-700 group-hover:text-brand-700 transition-colors">Click to upload PDF</p>
                    <p className="text-sm text-slate-400 mt-2 group-hover:text-slate-500">Only .pdf files allowed</p>
                </label>
            )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 max-w-lg mx-auto">
        <button
            onClick={onPrev}
            className="flex-1 py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold backdrop-blur-sm transition-colors flex items-center justify-center"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
            onClick={onNext}
            disabled={!pdfTemplate}
            className="flex-[2] py-3.5 px-6 bg-white text-brand-600 hover:bg-brand-50 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Next: Review
            <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default StepPdfUpload;