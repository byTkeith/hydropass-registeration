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
    
    // Load the PDF template for each guest to create a unique instance
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const pageHeight = page.getSize().height;
    
    // Embed standard font
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;

    // Helper to place text with top-based mm coordinates (matching the OCR logic)
    const placeText = (text: string, mmX: number, mmY: number, size = fontSize) => {
        const xPt = toPt(mmX);
        // Coordinate system in PDF is bottom-left, so we flip the Y axis relative to top
        const yPt = pageHeight - toPt(mmY) - size * 0.15;
        
        page.drawText(text || "", { 
            x: xPt, 
            y: yPt, 
            size, 
            font: helvetica, 
            color: rgb(0, 0, 0) 
        });
    };

    // --- MAPPING COORDINATES FROM OCR ---
    // 1. Unit Number
    placeText(unitNumber, 79.15, 95.98);
    
    // 2. Guest Name
    placeText(guest.name || "", 76.59, 106.0);
    
    // 3. Guest ID
    placeText(guest.idNumber || "", 89.18, 115.81);
    
    // 4. Contact Number
    placeText(guest.contactNumber || "", 98.14, 126.05);
    
    // 5. Vehicle Make & Reg
    const vehicleText = `${guest.vehicleMake || ""} ${guest.vehicleReg || ""}`.trim();
    placeText(vehicleText, 114.05, 137.75);
    
    // 6. Parking Bay
    placeText(guest.parkingBay || "", 99.99, 146.9);
    
    // 7. Check In
    placeText(guest.checkIn || "", 86.72, 157.13);
    
    // 8. Check Out
    placeText(guest.checkOut || "", 89.48, 167.06);
    
    // Signature (Guest Name)
    placeText(guest.name || "", 69.82, 236.53, 10);
    
    // Date Signed (Today)
    placeText(new Date().toLocaleDateString(), 64.06, 247.04, 11);

    // Save
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    
    // Create File object
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
        // Remove the data:application/pdf;base64, prefix
        const base64Content = result.split(",")[1];
        resolve({ name: file.name, content: base64Content });
    };
    reader.onerror = reject;
  });
