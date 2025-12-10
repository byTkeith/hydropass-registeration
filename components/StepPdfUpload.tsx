import React from 'react';
import { FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
       <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-2">
            <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Form Template</h2>
        <p className="text-gray-500">Upload the blank Biometric Form PDF.</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all ${pdfTemplate ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:border-brand-400'}`}>
            <input 
                type="file" 
                id="template-upload" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleUpload}
            />
            
            {pdfTemplate ? (
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">{pdfTemplate.name}</p>
                    <p className="text-xs text-gray-500 mb-4">{(pdfTemplate.size / 1024).toFixed(0)} KB</p>
                    <button 
                        onClick={() => setPdfTemplate(null)}
                        className="text-sm text-red-500 hover:text-red-700 underline"
                    >
                        Replace File
                    </button>
                </div>
            ) : (
                <label htmlFor="template-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Click to upload PDF</p>
                    <p className="text-sm text-gray-400 mt-2">Only .pdf files allowed</p>
                </label>
            )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 max-w-md mx-auto">
        <button
            onClick={onPrev}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <button
            onClick={onNext}
            disabled={!pdfTemplate}
            className="flex-[2] py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            Next: Review
            <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default StepPdfUpload;