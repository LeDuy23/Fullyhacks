import html2pdf from "html2pdf.js";
import { formatCurrency } from "./currency";

interface ClaimSummary {
  claim: {
    id: number;
    claimantId: number;
    totalValue: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  claimant: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    policyNumber: string | null;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    language: string;
    currency: string;
    createdAt: string;
  };
  rooms: {
    id: number;
    claimId: number;
    name: string;
    isCustom: boolean;
    items: {
      id: number;
      roomId: number;
      name: string;
      description: string | null;
      category: string | null;
      cost: number;
      quantity: number;
      purchaseDate: string | null;
      imageUrls: string[];
      createdAt: string;
    }[];
  }[];
}

interface PDFOptions {
  template: "standard" | "detailed" | "insurance" | "wildfire-basic" | "wildfire-detailed" | "wildfire-rush";
  includePhotos: boolean;
}

export async function generatePDF(summary: ClaimSummary, options: PDFOptions): Promise<void> {
  // Create a container element for the PDF content
  const container = document.createElement("div");
  container.style.fontFamily = "Arial, sans-serif";
  container.style.padding = "20px";
  
  // Add header - customize based on template type
  const header = document.createElement("div");
  
  // Custom header for wildfire templates
  if (options.template.startsWith("wildfire-")) {
    const headerColor = options.template === "wildfire-rush" 
      ? "#ef4444" // Red for rush template
      : "#f97316"; // Orange for regular wildfire templates
      
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid ${headerColor}; padding-bottom: 10px;">
        <div>
          <h1 style="color: ${headerColor}; font-size: 24px; margin: 0;">InsureClaim</h1>
          <p style="color: #64748b; margin: 5px 0 0;">Wildfire Damage Claim Documentation</p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <p style="color: ${headerColor}; font-weight: bold; margin: 0;">Date: ${new Date().toLocaleDateString()}</p>
          ${options.template === "wildfire-rush" ? '<p style="color: #ef4444; font-weight: bold; margin: 0;">PRIORITY PROCESSING</p>' : ''}
        </div>
      </div>
    `;
  } else {
    // Standard header for regular templates
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 10px;">
        <div>
          <h1 style="color: #0284c7; font-size: 24px; margin: 0;">InsureClaim</h1>
          <p style="color: #64748b; margin: 5px 0 0;">Insurance Claim Documentation</p>
        </div>
        <div>
          <p style="color: #0284c7; font-weight: bold; margin: 0;">Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
  }
  
  container.appendChild(header);
  
  // Add claimant information
  const claimantInfo = document.createElement("div");
  claimantInfo.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 10px;">Personal Information</h2>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 15px;">
        <p><strong>Name:</strong> ${summary.claimant.fullName}</p>
        <p><strong>Email:</strong> ${summary.claimant.email}</p>
        <p><strong>Phone:</strong> ${summary.claimant.phone}</p>
        ${summary.claimant.policyNumber ? `<p><strong>Policy Number:</strong> ${summary.claimant.policyNumber}</p>` : ''}
        <p><strong>Address:</strong> ${summary.claimant.streetAddress}, ${summary.claimant.city}, ${summary.claimant.state}, ${summary.claimant.zipCode}, ${summary.claimant.country}</p>
      </div>
    </div>
  `;
  container.appendChild(claimantInfo);
  
  // Add claim summary
  const claimSummary = document.createElement("div");
  claimSummary.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 10px;">Claim Summary</h2>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 15px;">
        <p><strong>Claim ID:</strong> ${summary.claim.id}</p>
        <p><strong>Status:</strong> ${summary.claim.status.charAt(0).toUpperCase() + summary.claim.status.slice(1)}</p>
        <p><strong>Total Value:</strong> ${formatCurrency(summary.claim.totalValue, summary.claimant.currency)}</p>
        <p><strong>Created On:</strong> ${new Date(summary.claim.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  `;
  container.appendChild(claimSummary);
  
  // Add items by room - customize heading based on template
  const itemsByRoom = document.createElement("div");
  
  // Special headings for wildfire templates
  if (options.template.startsWith("wildfire-")) {
    const bgColor = options.template === "wildfire-rush" ? "#fee2e2" : "#ffedd5";
    
    itemsByRoom.innerHTML = `
      <div style="background-color: ${bgColor}; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 5px;">Wildfire Damage Inventory</h2>
        <p style="color: #64748b; margin: 0; font-size: 14px;">
          ${options.template === "wildfire-rush" 
            ? 'Priority processing for expedited insurance claim processing.' 
            : (options.template === "wildfire-detailed" 
              ? 'Comprehensive documentation of items damaged or destroyed by wildfire.' 
              : 'Basic list of items damaged or destroyed by wildfire.')}
        </p>
      </div>
    `;
  } else {
    itemsByRoom.innerHTML = `
      <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 10px;">Items by Room</h2>
    `;
  }
  
  if (summary.rooms.length === 0) {
    itemsByRoom.innerHTML += `
      <p style="color: #64748b;">No rooms or items have been added to this claim.</p>
    `;
  } else {
    summary.rooms.forEach((room) => {
      const roomSection = document.createElement("div");
      roomSection.style.marginBottom = "15px";
      roomSection.style.pageBreakInside = "avoid";
      
      roomSection.innerHTML = `
        <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 5px; padding: 8px; background-color: #f1f5f9; border-radius: 5px;">${room.name}</h3>
      `;
      
      if (room.items.length === 0) {
        roomSection.innerHTML += `
          <p style="color: #64748b; padding-left: 10px;">No items added to this room.</p>
        `;
      } else {
        const itemsTable = document.createElement("table");
        itemsTable.style.width = "100%";
        itemsTable.style.borderCollapse = "collapse";
        itemsTable.style.marginBottom = "10px";
        
        // Table header - customize based on template
        const tableHeader = document.createElement("thead");
        
        // Determine the table header background and border colors based on template
        let headerBgColor = "#e2e8f0";
        let headerBorderColor = "#cbd5e1";
        
        // Special styling for wildfire templates
        if (options.template.startsWith("wildfire-")) {
          headerBgColor = options.template === "wildfire-rush" ? "#fecaca" : "#fed7aa";
          headerBorderColor = options.template === "wildfire-rush" ? "#ef4444" : "#f97316";
        }
        
        // Build table headers based on template type
        let headerHtml = `
          <tr style="background-color: ${headerBgColor};">
            <th style="padding: 8px; text-align: left; border: 1px solid ${headerBorderColor};">Item</th>`;
            
        // Add description column for detailed templates
        if (options.template === "detailed" || options.template === "wildfire-detailed") {
          headerHtml += `<th style="padding: 8px; text-align: left; border: 1px solid ${headerBorderColor};">Description</th>`;
        }
        
        // Common columns
        headerHtml += `
            <th style="padding: 8px; text-align: center; border: 1px solid ${headerBorderColor};">Qty</th>
            <th style="padding: 8px; text-align: right; border: 1px solid ${headerBorderColor};">Value</th>`;
        
        // Add purchase date column for insurance template
        if (options.template === "insurance") {
          headerHtml += `<th style="padding: 8px; text-align: center; border: 1px solid ${headerBorderColor};">Purchase Date</th>`;
        }
        
        // Add replacement priority column for wildfire rush template
        if (options.template === "wildfire-rush") {
          headerHtml += `<th style="padding: 8px; text-align: center; border: 1px solid ${headerBorderColor};">Priority</th>`;
        }
        
        headerHtml += `</tr>`;
        tableHeader.innerHTML = headerHtml;
        itemsTable.appendChild(tableHeader);
        
        // Table body
        const tableBody = document.createElement("tbody");
        let roomTotal = 0;
        
        room.items.forEach((item) => {
          const itemRow = document.createElement("tr");
          itemRow.style.borderBottom = "1px solid #e2e8f0";
          
          const itemCost = item.cost * item.quantity;
          roomTotal += itemCost;
          
          // Determine cell border color based on template
          const cellBorderColor = options.template.startsWith("wildfire-") 
            ? (options.template === "wildfire-rush" ? "#ef4444" : "#f97316") 
            : "#cbd5e1";
          
          // Build cell HTML based on template type
          let cellHtml = `
            <td style="padding: 8px; border: 1px solid ${cellBorderColor};">${item.name} ${item.category ? `<span style="color: #64748b; font-size: 12px;">(${item.category})</span>` : ''}</td>`;
            
          // Add description column for detailed templates
          if (options.template === "detailed" || options.template === "wildfire-detailed") {
            cellHtml += `<td style="padding: 8px; border: 1px solid ${cellBorderColor};">${item.description || ''}</td>`;
          }
          
          // Common columns
          cellHtml += `
            <td style="padding: 8px; text-align: center; border: 1px solid ${cellBorderColor};">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid ${cellBorderColor};">${formatCurrency(itemCost, summary.claimant.currency)}</td>`;
          
          // Add purchase date column for insurance template
          if (options.template === "insurance") {
            cellHtml += `<td style="padding: 8px; text-align: center; border: 1px solid ${cellBorderColor};">${item.purchaseDate || 'N/A'}</td>`;
          }
          
          // Add priority column for wildfire-rush template - simulate a priority level based on cost
          if (options.template === "wildfire-rush") {
            // Simulate priority level based on item cost (higher cost = higher priority)
            let priorityText = "Low";
            let priorityColor = "#22c55e"; // Green
            
            if (itemCost > 1000) {
              priorityText = "High";
              priorityColor = "#ef4444"; // Red
            } else if (itemCost > 500) {
              priorityText = "Medium";
              priorityColor = "#f59e0b"; // Amber
            }
            
            cellHtml += `<td style="padding: 8px; text-align: center; border: 1px solid ${cellBorderColor};">
              <span style="font-weight: bold; color: ${priorityColor};">${priorityText}</span>
            </td>`;
          }
          
          itemRow.innerHTML = cellHtml;
          tableBody.appendChild(itemRow);
          
          // Add images if requested and available
          if (options.includePhotos && item.imageUrls && item.imageUrls.length > 0 && options.template !== "standard") {
            const imageRow = document.createElement("tr");
            const imageCell = document.createElement("td");
            imageCell.style.padding = "8px";
            
            // Get border color based on template
            const cellBorderColor = options.template.startsWith("wildfire-") 
              ? (options.template === "wildfire-rush" ? "#ef4444" : "#f97316") 
              : "#cbd5e1";
            imageCell.style.border = `1px solid ${cellBorderColor}`;
            
            // Calculate colspan based on template type
            let colSpan = 3; // Default
            
            if (options.template === "detailed" || options.template === "wildfire-detailed") {
              colSpan = 4; // With description column
            }
            
            if (options.template === "insurance") {
              colSpan = 5; // With purchase date column
            }
            
            if (options.template === "wildfire-rush") {
              colSpan = 4; // With priority column
            }
            
            imageCell.colSpan = colSpan;
            
            const imageContainer = document.createElement("div");
            imageContainer.style.display = "flex";
            imageContainer.style.flexWrap = "wrap";
            imageContainer.style.gap = "5px";
            
            // Add special styling for wildfire templates - highlight damage
            let captionText = "";
            if (options.template.startsWith("wildfire-")) {
              // Add damage indicator for wildfire templates
              captionText = options.template === "wildfire-rush" 
                ? "<strong style='color: #ef4444;'>Fire Damage Evidence</strong>" 
                : "<strong style='color: #f97316;'>Wildfire Damage</strong>";
            }
            
            if (captionText) {
              const captionElement = document.createElement("div");
              captionElement.style.width = "100%";
              captionElement.style.marginBottom = "8px";
              captionElement.style.textAlign = "center";
              captionElement.innerHTML = captionText;
              imageContainer.appendChild(captionElement);
            }
            
            item.imageUrls.forEach((imageUrl) => {
              const imgWrapper = document.createElement("div");
              imgWrapper.style.position = "relative";
              
              const img = document.createElement("img");
              img.src = imageUrl;
              img.style.width = "100px";
              img.style.height = "100px";
              img.style.objectFit = "cover";
              img.style.borderRadius = "4px";
              
              // Add a special indicator for wildfire-rush template
              if (options.template === "wildfire-rush") {
                // Create an overlay label for priority items
                if (item.cost * item.quantity > 500) {
                  const overlay = document.createElement("div");
                  overlay.style.position = "absolute";
                  overlay.style.bottom = "0";
                  overlay.style.left = "0";
                  overlay.style.width = "100%";
                  overlay.style.backgroundColor = "rgba(239, 68, 68, 0.8)";
                  overlay.style.color = "white";
                  overlay.style.fontSize = "10px";
                  overlay.style.fontWeight = "bold";
                  overlay.style.padding = "2px 0";
                  overlay.style.textAlign = "center";
                  overlay.style.borderBottomLeftRadius = "4px";
                  overlay.style.borderBottomRightRadius = "4px";
                  overlay.textContent = "PRIORITY";
                  imgWrapper.appendChild(overlay);
                }
              }
              
              imgWrapper.appendChild(img);
              imageContainer.appendChild(imgWrapper);
            });
            
            imageCell.appendChild(imageContainer);
            imageRow.appendChild(imageCell);
            tableBody.appendChild(imageRow);
          }
        });
        
        // Room total row - customize based on template
        const totalRow = document.createElement("tr");
        totalRow.style.fontWeight = "bold";
        
        // Set background color and border based on template
        if (options.template.startsWith("wildfire-")) {
          const bgColor = options.template === "wildfire-rush" ? "#fee2e2" : "#ffedd5";
          const borderColor = options.template === "wildfire-rush" ? "#ef4444" : "#f97316";
          
          totalRow.style.backgroundColor = bgColor;
          
          // Calculate colspan based on template and column count
          let colSpan = 2; // Default
          
          if (options.template === "wildfire-detailed") {
            colSpan = 3; // Name, description, quantity
          }
          
          if (options.template === "wildfire-rush") {
            colSpan = 3; // Name, quantity, priority
          }
          
          const totalLabel = options.template === "wildfire-rush" ? "Priority Room Total:" : "Wildfire Damage Total:";
          
          totalRow.innerHTML = `
            <td style="padding: 8px; text-align: right; border: 1px solid ${borderColor};" colspan="${colSpan}">${totalLabel}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid ${borderColor};">${formatCurrency(roomTotal, summary.claimant.currency)}</td>
          `;
        } else {
          totalRow.style.backgroundColor = "#f8fafc";
          
          // Calculate colspan based on template and column count
          const colSpan = options.template === "detailed" ? 3 : (options.template === "insurance" ? 4 : 2);
          
          totalRow.innerHTML = `
            <td style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;" colspan="${colSpan}">Room Total:</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(roomTotal, summary.claimant.currency)}</td>
          `;
        }
        tableBody.appendChild(totalRow);
        
        itemsTable.appendChild(tableBody);
        roomSection.appendChild(itemsTable);
      }
      
      itemsByRoom.appendChild(roomSection);
    });
  }
  
  container.appendChild(itemsByRoom);
  
  // Add total value
  const totalSection = document.createElement("div");
  totalSection.style.marginTop = "20px";
  totalSection.style.padding = "10px";
  
  // Customize the total section based on template
  if (options.template.startsWith("wildfire-")) {
    const bgColor = options.template === "wildfire-rush" ? "#fee2e2" : "#ffedd5";
    const borderColor = options.template === "wildfire-rush" ? "#ef4444" : "#f97316";
    const textColor = options.template === "wildfire-rush" ? "#ef4444" : "#f97316";
    
    totalSection.style.backgroundColor = bgColor;
    totalSection.style.borderRadius = "5px";
    totalSection.style.borderLeft = `4px solid ${borderColor}`;
    
    // For rush template, add additional priority information
    const priorityInfo = options.template === "wildfire-rush" ? 
      `<div style="margin-top: 8px; padding: 5px; border: 1px dashed #ef4444; border-radius: 3px; text-align: center;">
        <p style="color: #ef4444; font-weight: bold; margin: 0; font-size: 14px;">PRIORITY CLAIM - EXPEDITED PROCESSING REQUESTED</p>
      </div>` : '';
    
    totalSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="color: #0f172a; font-size: 18px; margin: 0;">Total Wildfire Damage Value:</h2>
        <p style="color: ${textColor}; font-size: 20px; font-weight: bold; margin: 0;">${formatCurrency(summary.claim.totalValue, summary.claimant.currency)}</p>
      </div>
      ${priorityInfo}
    `;
  } else {
    totalSection.style.backgroundColor = "#f0f9ff";
    totalSection.style.borderRadius = "5px";
    totalSection.style.borderLeft = "4px solid #0284c7";
    
    totalSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="color: #0f172a; font-size: 18px; margin: 0;">Total Claim Value:</h2>
        <p style="color: #0284c7; font-size: 20px; font-weight: bold; margin: 0;">${formatCurrency(summary.claim.totalValue, summary.claimant.currency)}</p>
      </div>
    `;
  }
  container.appendChild(totalSection);
  
  // Add footer with template info - customize based on template type
  const footer = document.createElement("div");
  footer.style.marginTop = "30px";
  footer.style.paddingTop = "10px";
  footer.style.fontSize = "12px";
  
  if (options.template.startsWith("wildfire-")) {
    const borderColor = options.template === "wildfire-rush" ? "#ef4444" : "#f97316";
    const textColor = options.template === "wildfire-rush" ? "#b91c1c" : "#c2410c";
    
    footer.style.borderTop = `1px solid ${borderColor}`;
    footer.style.color = textColor;
    
    // Add special legal disclaimer for wildfire templates
    let disclaimer = '';
    if (options.template === "wildfire-rush") {
      disclaimer = `<p style="margin-top: 8px; border-top: 1px dashed #ef4444; padding-top: 8px; font-style: italic;">
        This is a priority wildfire claim document intended for expedited processing. 
        All information is provided in good faith and to the best knowledge of the claimant at this time.
      </p>`;
    } else if (options.template === "wildfire-detailed") {
      disclaimer = `<p style="margin-top: 8px; font-style: italic;">
        This document contains a comprehensive inventory of items damaged or destroyed by wildfire.
        Additional documentation may be provided as it becomes available.
      </p>`;
    } else {
      disclaimer = `<p style="margin-top: 8px; font-style: italic;">
        This basic wildfire claim document lists items damaged or destroyed. 
        The claimant reserves the right to supplement this list as additional losses are discovered.
      </p>`;
    }
    
    footer.innerHTML = `
      <p>Document generated using InsureClaim Wildfire Relief System - ${new Date().toLocaleString()}</p>
      <p>Template: ${options.template.charAt(0).toUpperCase() + options.template.slice(1).replace('-', ' ')}</p>
      ${disclaimer}
    `;
  } else {
    footer.style.borderTop = "1px solid #e2e8f0";
    footer.style.color = "#64748b";
    
    footer.innerHTML = `
      <p>Document generated using InsureClaim - ${new Date().toLocaleString()}</p>
      <p>Template: ${options.template.charAt(0).toUpperCase() + options.template.slice(1)}</p>
    `;
  }
  container.appendChild(footer);
  
  // Generate PDF
  document.body.appendChild(container);
  
  // Customize the PDF options based on template type
  const pdfOptions: any = {
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Add template-specific filename
  if (options.template.startsWith("wildfire-")) {
    const templatePrefix = options.template === "wildfire-rush" ? "PRIORITY_" : "";
    pdfOptions.filename = `${templatePrefix}WildfireClaim_${summary.claim.id}.pdf`;
  } else {
    pdfOptions.filename = `InsureClaim_${summary.claim.id}.pdf`;
  }
  
  try {
    await html2pdf()
      .set(pdfOptions)
      .from(container)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}
