import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  claimId: number;
  onExport: () => void;
}

type TemplateType = "standard" | "detailed" | "insurance" | "wildfire-basic" | "wildfire-detailed" | "wildfire-rush";

const ExportOptions: React.FC<ExportOptionsProps> = ({ claimId, onExport }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("standard");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Fetch the claim summary
      const response = await fetch(`/api/claims/${claimId}/summary`);
      if (!response.ok) {
        throw new Error("Failed to fetch claim summary");
      }
      
      const summary = await response.json();
      
      // Generate the PDF based on the selected template
      generatePDF(summary, selectedTemplate, includePhotos);
      
      onExport();
      toast({
        title: "PDF Generated",
        description: "Your claim document has been successfully exported."
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDF = (summary: any, template: TemplateType, includePhotos: boolean) => {
    // Create a container element for the PDF content
    const container = document.createElement("div");
    container.style.fontFamily = "Arial, sans-serif";
    container.style.padding = "20px";
    
    // Add header
    const header = document.createElement("div");
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
          <p><strong>Total Value:</strong> $${summary.claim.totalValue.toFixed(2)}</p>
          <p><strong>Created On:</strong> ${new Date(summary.claim.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `;
    container.appendChild(claimSummary);
    
    // Add items by room
    const itemsByRoom = document.createElement("div");
    itemsByRoom.innerHTML = `
      <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 10px;">Items by Room</h2>
    `;
    
    if (summary.rooms.length === 0) {
      itemsByRoom.innerHTML += `
        <p style="color: #64748b;">No rooms or items have been added to this claim.</p>
      `;
    } else {
      summary.rooms.forEach((room: any) => {
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
          
          // Table header
          const tableHeader = document.createElement("thead");
          tableHeader.innerHTML = `
            <tr style="background-color: #e2e8f0;">
              <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Item</th>
              ${template === "detailed" ? '<th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1;">Description</th>' : ''}
              <th style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">Qty</th>
              <th style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;">Value</th>
              ${template === "insurance" ? '<th style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">Purchase Date</th>' : ''}
            </tr>
          `;
          itemsTable.appendChild(tableHeader);
          
          // Table body
          const tableBody = document.createElement("tbody");
          let roomTotal = 0;
          
          room.items.forEach((item: any) => {
            const itemRow = document.createElement("tr");
            itemRow.style.borderBottom = "1px solid #e2e8f0";
            
            const itemCost = item.cost * item.quantity;
            roomTotal += itemCost;
            
            itemRow.innerHTML = `
              <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.name} ${item.category ? `<span style="color: #64748b; font-size: 12px;">(${item.category})</span>` : ''}</td>
              ${template === "detailed" ? `<td style="padding: 8px; border: 1px solid #cbd5e1;">${item.description || ''}</td>` : ''}
              <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${item.quantity}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;">$${itemCost.toFixed(2)}</td>
              ${template === "insurance" ? `<td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${item.purchaseDate || 'N/A'}</td>` : ''}
            `;
            tableBody.appendChild(itemRow);
            
            // Add images if requested and available
            if (includePhotos && item.imageUrls && item.imageUrls.length > 0 && template !== "standard") {
              const imageRow = document.createElement("tr");
              const imageCell = document.createElement("td");
              imageCell.style.padding = "8px";
              imageCell.style.border = "1px solid #cbd5e1";
              imageCell.colSpan = template === "detailed" ? 4 : (template === "insurance" ? 5 : 3);
              
              const imageContainer = document.createElement("div");
              imageContainer.style.display = "flex";
              imageContainer.style.flexWrap = "wrap";
              imageContainer.style.gap = "5px";
              
              item.imageUrls.forEach((imageUrl: string) => {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.style.width = "100px";
                img.style.height = "100px";
                img.style.objectFit = "cover";
                img.style.borderRadius = "4px";
                imageContainer.appendChild(img);
              });
              
              imageCell.appendChild(imageContainer);
              imageRow.appendChild(imageCell);
              tableBody.appendChild(imageRow);
            }
          });
          
          // Room total row
          const totalRow = document.createElement("tr");
          totalRow.style.backgroundColor = "#f8fafc";
          totalRow.style.fontWeight = "bold";
          
          const colSpan = template === "detailed" ? 3 : (template === "insurance" ? 4 : 2);
          
          totalRow.innerHTML = `
            <td style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;" colspan="${colSpan}">Room Total:</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #cbd5e1;">$${roomTotal.toFixed(2)}</td>
          `;
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
    totalSection.style.backgroundColor = "#f0f9ff";
    totalSection.style.borderRadius = "5px";
    totalSection.style.borderLeft = "4px solid #0284c7";
    
    totalSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="color: #0f172a; font-size: 18px; margin: 0;">Total Claim Value:</h2>
        <p style="color: #0284c7; font-size: 20px; font-weight: bold; margin: 0;">$${summary.claim.totalValue.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(totalSection);
    
    // Add footer with template info
    const footer = document.createElement("div");
    footer.style.marginTop = "30px";
    footer.style.borderTop = "1px solid #e2e8f0";
    footer.style.paddingTop = "10px";
    footer.style.color = "#64748b";
    footer.style.fontSize = "12px";
    
    footer.innerHTML = `
      <p>Document generated using InsureClaim - ${new Date().toLocaleString()}</p>
      <p>Template: ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</p>
    `;
    container.appendChild(footer);
    
    // Generate PDF
    document.body.appendChild(container);
    
    const pdfOptions = {
      margin: 10,
      filename: `InsureClaim_${summary.claim.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf()
      .set(pdfOptions)
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold text-slate-800 mb-2">Choose an Insurance Company Template</h3>
      <p className="text-sm text-slate-600 mb-3">Select a template format aligned with common insurance company requirements:</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-yellow-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> These templates are designed to help you organize your claim information in a format similar to what insurance companies typically require. Always check with your specific insurance provider for their exact submission requirements.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
        
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="flex items-center gap-2 border-b pb-2 mb-3">
            <i className="ri-shield-check-line text-xl text-primary-600"></i>
            <h3 className="text-md font-semibold text-slate-800">Major Insurance Company Templates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="relative">
              <input 
                id="template-standard" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "standard"} 
                onChange={() => handleTemplateChange("standard")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-standard" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-file-list-3-line text-2xl text-slate-600 mb-1"></i>
                  {selectedTemplate === "standard" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">Farmers-Style</span>
                <span className="text-xs text-slate-500">Basic inventory format</span>
              </label>
            </div>
            
            <div className="relative">
              <input 
                id="template-detailed" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "detailed"}
                onChange={() => handleTemplateChange("detailed")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-detailed" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-file-text-line text-2xl text-slate-600 mb-1"></i>
                  {selectedTemplate === "detailed" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">Liberty Mutual-Style</span>
                <span className="text-xs text-slate-500">Detailed with descriptions</span>
              </label>
            </div>
            
            <div className="relative">
              <input 
                id="template-insurance" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "insurance"}
                onChange={() => handleTemplateChange("insurance")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-insurance" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-file-damage-line text-2xl text-slate-600 mb-1"></i>
                  {selectedTemplate === "insurance" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">Progressive-Style</span>
                <span className="text-xs text-slate-500">Includes purchase dates</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center gap-2 border-b pb-2 mb-3 mt-4">
            <i className="ri-fire-fill text-xl text-orange-500"></i>
            <h3 className="text-md font-semibold text-slate-800">Wildfire Insurance Company Templates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <input 
                id="template-wildfire-basic" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "wildfire-basic"} 
                onChange={() => handleTemplateChange("wildfire-basic")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-wildfire-basic" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-fire-line text-2xl text-orange-500 mb-1"></i>
                  {selectedTemplate === "wildfire-basic" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">State Farm-Style</span>
                <span className="text-xs text-slate-500">Basic wildfire format</span>
              </label>
            </div>
            
            <div className="relative">
              <input 
                id="template-wildfire-detailed" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "wildfire-detailed"}
                onChange={() => handleTemplateChange("wildfire-detailed")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-wildfire-detailed" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-file-damage-fill text-2xl text-orange-600 mb-1"></i>
                  {selectedTemplate === "wildfire-detailed" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">Allstate</span>
                <span className="text-xs text-slate-500">Allstate wildfire claim</span>
              </label>
            </div>
            
            <div className="relative">
              <input 
                id="template-wildfire-rush" 
                name="pdf-template" 
                type="radio" 
                checked={selectedTemplate === "wildfire-rush"}
                onChange={() => handleTemplateChange("wildfire-rush")}
                className="absolute opacity-0 h-0 w-0 peer" 
              />
              <label 
                htmlFor="template-wildfire-rush" 
                className="flex flex-col items-center p-4 border-2 border-slate-200 rounded-md cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md peer-checked:transform peer-checked:scale-105 hover:bg-slate-100 transition-all duration-200"
              >
                <div className="relative">
                  <i className="ri-alarm-warning-line text-2xl text-red-600 mb-1"></i>
                  {selectedTemplate === "wildfire-rush" && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">USAA</span>
                <span className="text-xs text-slate-500">USAA expedited claim</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Checkbox 
            id="include-photos" 
            checked={includePhotos} 
            onCheckedChange={(checked) => setIncludePhotos(checked as boolean)}
          />
          <label htmlFor="include-photos" className="ml-2 block text-sm text-slate-700">
            Include photos in the exported PDF
          </label>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-center mb-3 text-slate-600">Once you've selected the appropriate template, click the button below to generate your claim document</div>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="inline-flex justify-center items-center w-full py-5 text-lg font-medium bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Insurance Claim PDF...</span>
            </>
          ) : (
            <>
              <i className="ri-file-download-line mr-2 text-xl"></i>
              Generate Insurance Claim PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
