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
  processingError: string | null;
  generatedFiles: File[];
}

// Pre-filled with the building management emails from the original requirement
export const DEFAULT_EMAIL = "hpstobookings@gmail.com, hpbookings@icloud.com, hydroparkfm@gmail.com, hydroparkreception@gmail.com, vishaun.b.maharaj@icloud.com";

// Point to the local Vercel API route
export const API_ENDPOINT = "/api/send-email";