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

// Use VITE_API_URL if set (for external backend), otherwise fall back to Vercel route for legacy support
export const API_ENDPOINT = (import.meta as any).env?.VITE_API_URL || "/api/send-email";