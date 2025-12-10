import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Guest } from "../types";

// Convert mm → points (1 mm ≈ 2.835 pt)
const toPt = (mm: number) => mm * 2.835;

export async function fillGuestForms(
  templateFile: File,
  guests: Guest[],
  unitNumber: string
): Promise<File[]> {
  const templateBytes = await templateFile.arrayBuffer();
  const results: File[] = [];

  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const pageHeight = page.getSize().height;
    
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;

    const placeText = (text: string, mmX: number, mmY: number, size = fontSize) => {
        const xPt = toPt(mmX);
        const yPt = pageHeight - toPt(mmY) - size * 0.15;
        
        page.drawText(text || "", { 
            x: xPt, 
            y: yPt, 
            size, 
            font: helvetica, 
            color: rgb(0, 0, 0) 
        });
    };

    // --- COORDINATES ---
    placeText(unitNumber, 79.15, 95.98);
    placeText(guest.name || "", 76.59, 106.0);
    placeText(guest.idNumber || "", 89.18, 115.81);
    placeText(guest.contactNumber || "", 98.14, 126.05);
    const vehicleText = `${guest.vehicleMake || ""} ${guest.vehicleReg || ""}`.trim();
    placeText(vehicleText, 114.05, 137.75);
    placeText(guest.parkingBay || "", 99.99, 146.9);
    placeText(guest.checkIn || "", 86.72, 157.13);
    placeText(guest.checkOut || "", 89.48, 167.06);
    // Signature
    placeText(guest.name || "", 69.82, 236.53, 10);
    // Date
    placeText(new Date().toLocaleDateString(), 64.06, 247.04, 11);

    const pdfBytes = await pdfDoc.save();
    // Cast pdfBytes to any to avoid TypeScript error regarding SharedArrayBuffer/BlobPart
    const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
    
    const fileName = `GuestForm_Unit${unitNumber}_${guest.name.replace(/\s+/g, '_')}.pdf`;
    results.push(new File([blob], fileName, { type: "application/pdf" }));
  }

  return results;
}

export const fileToBase64 = (file: File): Promise<{ name: string; content: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        const base64Content = result.split(",")[1];
        resolve({ name: file.name, content: base64Content });
    };
    reader.onerror = reject;
  });