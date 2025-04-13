
import html2pdf from 'html2pdf.js';
import { Item, Room, User, Claim } from './schema';

interface PDFExportOptions {
  filename?: string;
  margin?: number;
  imageQuality?: number;
}

// Generate a PDF from the claim data
export async function exportClaimToPDF(
  claim: Claim,
  rooms: Room[],
  items: Item[],
  user: User,
  options: PDFExportOptions = {}
): Promise<void> {
  // Create a temporary div element to render content
  const element = document.createElement('div');
  element.className = 'pdf-export-container';
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';
  
  // Add claim header
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 style="text-align: center; color: #333;">Wildfire Claim Report</h1>
    <p style="text-align: center; font-size: 14px;">Claim ID: ${claim.id}</p>
    <p style="text-align: center; font-size: 14px;">Date: ${new Date(claim.createdAt).toLocaleDateString()}</p>
    <hr style="border: 1px solid #eee; margin: 20px 0;" />
  `;
  element.appendChild(header);
  
  // Sort rooms and items by creation date
  const sortedRooms = [...rooms].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
  // Generate content for each room and its items
  sortedRooms.forEach(room => {
    const roomItems = items.filter(item => item.roomId === room.id);
    
    if (roomItems.length === 0) return;
    
    const roomSection = document.createElement('div');
    roomSection.style.marginBottom = '30px';
    
    roomSection.innerHTML = `
      <h2 style="color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px;">${room.name}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Cost</th>
          </tr>
        </thead>
        <tbody>
          ${roomItems.map(item => `
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.description || ''}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: item.currency
              }).format(item.cost)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    element.appendChild(roomSection);
  });
  
  // Add summary section
  const summary = document.createElement('div');
  summary.style.marginTop = '30px';
  summary.style.borderTop = '2px solid #333';
  summary.style.paddingTop = '10px';
  
  const totalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: claim.currency
  }).format(claim.totalAmount);
  
  summary.innerHTML = `
    <h2 style="color: #333;">Claim Summary</h2>
    <p><strong>Total Items:</strong> ${items.length}</p>
    <p><strong>Total Rooms:</strong> ${rooms.length}</p>
    <p><strong>Total Claim Amount:</strong> ${totalAmount}</p>
    <p><strong>Claim Status:</strong> ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</p>
    ${claim.notes ? `<p><strong>Notes:</strong> ${claim.notes}</p>` : ''}
  `;
  
  element.appendChild(summary);
  
  // Temporarily append to document body
  document.body.appendChild(element);
  
  // Configure PDF options
  const pdfOptions = {
    margin: options.margin || 10,
    filename: options.filename || `wildfire-claim-${claim.id}.pdf`,
    image: { type: 'jpeg', quality: options.imageQuality || 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Generate PDF
  try {
    await html2pdf().from(element).set(pdfOptions).save();
  } finally {
    // Clean up the temporary element
    document.body.removeChild(element);
  }
}
