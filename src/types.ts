export interface Guest {
  id: string;
  name: string;
  idNumber: string;
  contactNumber: string;
  vehicleMake: string;
  vehicleReg: string;
  parkingBay: string;
  checkIn: string;
  checkOut: string;
  duration?: string;
  idDocument: File | null;
}

export type Step = 'initial' | 'guestInfo' | 'pdfUpload' | 'emailConfig' | 'processing' | 'complete';

export interface AppState {
  currentStep: Step;
  unitNumber: string;
  guestCount: number;
  guests: Guest[];
  currentGuestIndex: number;
  pdfTemplate: File | null;
  emailAddresses: string;
  customHeading: string;
  isProcessing: boolean;
  processingStatus?: string;
  processingError: string | null;
  generatedFiles: File[];
}

// --- CHANGE EMAILS HERE FOR TESTING ---
export const DEFAULT_EMAIL = "hpstobookings@gmail.com, hpbookings@icloud.com, hydroparkfm@gmail.com, hydroparkreception@gmail.com, vishaun.b.maharaj@icloud.com";

// Vercel Serverless API Route
export const API_ENDPOINT = "/api/send-email";